import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserPlus, Hash, Mail, User, BookOpen, Check, ArrowRightLeft } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourseId?: string;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  preselectedCourseId
}) => {
  const { addStudent, courses, enrollStudentInCourse, switchUser, addToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [lastCreatedStudentId, setLastCreatedStudentId] = useState<string | null>(null);

  // Initialize selected courses when modal opens
  useEffect(() => {
    if (isOpen) {
      if (preselectedCourseId) {
        setSelectedCourseIds([preselectedCourseId]);
      } else {
        // By default select all courses so student is enrolled everywhere
        setSelectedCourseIds(courses.map(c => c.id));
      }
      setLastCreatedStudentId(null);
    }
  }, [isOpen, preselectedCourseId, courses]);

  // Suggest email & matric number as user types name
  const handleNameChange = (val: string) => {
    setName(val);
    if (!email || email.includes('@student.edu')) {
      const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '.');
      if (clean) {
        setEmail(`${clean}@student.edu`);
      }
    }
    if (!matricNumber) {
      setMatricNumber(`CSC/2024/${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleToggleCourse = (courseId: string) => {
    if (selectedCourseIds.includes(courseId)) {
      setSelectedCourseIds(selectedCourseIds.filter(id => id !== courseId));
    } else {
      setSelectedCourseIds([...selectedCourseIds, courseId]);
    }
  };

  const handleSelectAllCourses = () => {
    if (selectedCourseIds.length === courses.length) {
      setSelectedCourseIds([]);
    } else {
      setSelectedCourseIds(courses.map(c => c.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('error', 'Missing Information', 'Please provide student name.');
      return;
    }

    const finalEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@student.edu`;
    const finalMatric = matricNumber.trim() || `CSC/2024/${Math.floor(1000 + Math.random() * 9000)}`;

    const studentAvatars = [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ];
    const randomAvatar = studentAvatars[Math.floor(Math.random() * studentAvatars.length)];

    const created = addStudent({
      name: name.trim(),
      email: finalEmail,
      matricNumber: finalMatric,
      department: department.trim(),
      avatar: randomAvatar
    }, selectedCourseIds);

    setLastCreatedStudentId(created.id);
    onClose();
    setName('');
    setEmail('');
    setMatricNumber('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add & Enroll New Student"
      description="Register a student and enroll them in university courses"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Student Full Name <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="e.g. David Adeleke"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Academic Email & Matric Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Academic Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="d.adeleke@student.edu"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Matriculation Number
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={matricNumber}
                onChange={e => setMatricNumber(e.target.value)}
                placeholder="CSC/2024/0981"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Department
          </label>
          <input
            type="text"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Course Enrollments Multi-select */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Enroll In Courses ({selectedCourseIds.length} of {courses.length} selected)
            </label>
            <button
              type="button"
              onClick={handleSelectAllCourses}
              className="text-[11px] text-indigo-600 hover:underline font-semibold"
            >
              {selectedCourseIds.length === courses.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          <div className="border border-slate-200 rounded-lg p-2 max-h-36 overflow-y-auto space-y-1.5 bg-slate-50/50">
            {courses.map(c => {
              const isChecked = selectedCourseIds.includes(c.id);
              return (
                <label
                  key={c.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-white text-xs cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleCourse(c.id)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-mono font-bold text-slate-800">{c.code}</span>
                    <span className="text-slate-600 truncate max-w-[180px]">{c.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{c.level}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-500">
            Student will immediately be accessible in all selected courses.
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" leftIcon={<UserPlus className="w-3.5 h-3.5" />}>
              Add Student
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
