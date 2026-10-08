import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { BookOpen, Palette, Users } from 'lucide-react';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ isOpen, onClose }) => {
  const { addCourse, students, addToast } = useApp();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [level, setLevel] = useState('300 Level');
  const [semester, setSemester] = useState('First Semester');
  const [session, setSession] = useState('2026/2027');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(students.map(s => s.id));

  const colorPresets = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#8b5cf6', // purple
    '#f59e0b', // amber
    '#ef4444', // red
    '#06b6d4', // cyan
    '#4f46e5', // indigo
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) {
      addToast('error', 'Missing Information', 'Course Code and Course Name are required.');
      return;
    }

    addCourse({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      department,
      level,
      semester,
      session,
      description: description.trim() || `${name} curriculum for ${level} students.`,
      color,
      enrolledStudentIds: selectedStudentIds
    });

    onClose();
    // Reset fields
    setCode('');
    setName('');
    setDescription('');
  };

  const handleToggleStudent = (studentId: string) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New University Course"
      description="Register an academic course and enroll initial students"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Course Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="e.g. CSC 301"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Course Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Data Structures & Algorithms"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Level
            </label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="100 Level">100 Level</option>
              <option value="200 Level">200 Level</option>
              <option value="300 Level">300 Level</option>
              <option value="400 Level">400 Level</option>
              <option value="Postgraduate">Postgraduate</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Semester
            </label>
            <select
              value={semester}
              onChange={e => setSemester(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="First Semester">First Semester</option>
              <option value="Second Semester">Second Semester</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Academic Session
            </label>
            <input
              type="text"
              value={session}
              onChange={e => setSession(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Course Description & Syllabus Objectives
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Comprehensive overview of modules, laboratory requirements, and coursework expectations..."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />
        </div>

        {/* Color Accent Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Course Banner Accent Color
          </label>
          <div className="flex items-center gap-2">
            {colorPresets.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-800' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Enroll Students Checkbox List */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Enroll Registered Students ({selectedStudentIds.length} of {students.length} selected)
            </label>
            <button
              type="button"
              onClick={() => setSelectedStudentIds(selectedStudentIds.length === students.length ? [] : students.map(s => s.id))}
              className="text-[11px] text-indigo-600 hover:underline font-semibold"
            >
              {selectedStudentIds.length === students.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1">
            {students.map(st => {
              const isChecked = selectedStudentIds.includes(st.id);
              return (
                <label
                  key={st.id}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-white text-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleStudent(st.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-semibold text-slate-800">{st.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">{st.matricNumber}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Create Course
          </Button>
        </div>
      </form>
    </Modal>
  );
};
