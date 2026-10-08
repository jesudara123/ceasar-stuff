import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  BookOpen,
  GraduationCap,
  ExternalLink,
  Mail,
  Hash,
  Eye,
  FileCheck2,
  Clock,
  ArrowRightLeft,
  Sparkles
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

interface StudentManagementProps {
  onOpenAddStudentModal: () => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ onOpenAddStudentModal }) => {
  const {
    students,
    courses,
    assignments,
    submissions,
    removeStudent,
    enrollStudentInCourse,
    switchUser,
    setSelectedStudentId,
    selectedStudentId,
    setSelectedSubmissionId,
    setCurrentTab
  } = useApp();

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [studentToDelete, setStudentToDelete] = useState<User | null>(null);
  const [inspectStudent, setInspectStudent] = useState<User | null>(null);

  // Compute student stats
  const studentsWithStats = useMemo(() => {
    return students.map(student => {
      // Courses this student is enrolled in
      const enrolledCourses = courses.filter(c => c.enrolledStudentIds.includes(student.id));

      // Assignments applicable to this student
      const applicableAssignments = assignments.filter(a =>
        enrolledCourses.some(c => c.id === a.courseId) && a.status !== 'draft'
      );

      // Student's submissions
      const studentSubmissions = submissions.filter(s => s.studentId === student.id);
      const submittedCount = studentSubmissions.length;
      const missingCount = Math.max(0, applicableAssignments.length - submittedCount);

      // Graded submissions and average
      const graded = studentSubmissions.filter(s => s.score !== undefined);
      let avgGrade = 0;
      if (graded.length > 0) {
        const total = graded.reduce((sum, s) => sum + (s.score || 0), 0);
        const maxTotal = graded.reduce((sum, s) => {
          const asg = assignments.find(a => a.id === s.assignmentId);
          return sum + (asg?.totalMarks || 100);
        }, 0);
        avgGrade = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
      }

      // Status standing
      const status: 'Good Standing' | 'Needs Attention' = missingCount > 2 ? 'Needs Attention' : 'Good Standing';

      return {
        ...student,
        enrolledCourses,
        submittedCount,
        missingCount,
        applicableCount: applicableAssignments.length,
        avgGrade: graded.length > 0 ? `${avgGrade}%` : 'N/A',
        gradedCount: graded.length,
        statusStanding: status
      };
    });
  }, [students, courses, assignments, submissions]);

  const filteredStudents = useMemo(() => {
    return studentsWithStats.filter(st => {
      const q = search.toLowerCase();
      const matchesSearch =
        st.name.toLowerCase().includes(q) ||
        (st.matricNumber && st.matricNumber.toLowerCase().includes(q)) ||
        st.email.toLowerCase().includes(q);

      const matchesCourse =
        courseFilter === 'all' ||
        st.enrolledCourses.some(c => c.id === courseFilter);

      return matchesSearch && matchesCourse;
    });
  }, [studentsWithStats, search, courseFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Students Directory</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {filteredStudents.length} Registered
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">
            Monitor academic performance, submission rates, and matriculation statuses.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={onOpenAddStudentModal}
        >
          Add Student
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student name, matric number, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Filter by Course:</span>
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Enrolled Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            No students found matching your query.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Matric Number</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Courses Enrolled</th>
                <th className="py-3 px-4 text-center">Submitted</th>
                <th className="py-3 px-4 text-center">Missing</th>
                <th className="py-3 px-4 text-center">Average Grade</th>
                <th className="py-3 px-4">Standing</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(st => (
                <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">{st.name}</span>
                        <span className="text-[11px] text-slate-400">{st.department}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                    {st.matricNumber || '—'}
                  </td>

                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {st.email}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[170px]">
                      {st.enrolledCourses.length > 0 ? (
                        st.enrolledCourses.map(c => (
                          <span key={c.id} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                            {c.code}
                          </span>
                        ))
                      ) : (
                        <button
                          onClick={() => {
                            courses.forEach(c => enrollStudentInCourse(c.id, st.id));
                          }}
                          className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors"
                          title="Click to enroll student in all courses"
                        >
                          + Enroll in Courses
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center font-semibold text-emerald-700">
                    {st.submittedCount}
                  </td>

                  <td className="py-3.5 px-4 text-center font-semibold text-rose-600">
                    {st.missingCount}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {st.avgGrade}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={st.statusStanding === 'Good Standing' ? 'success' : 'warning'} size="sm">
                      {st.statusStanding}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs py-1"
                        onClick={() => setInspectStudent(st)}
                      >
                        Profile
                      </Button>
                      <button
                        onClick={() => switchUser(st.id)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Switch view to this student"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setStudentToDelete(st)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                        title="Remove Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Student Profile / Dossier Modal */}
      <Modal
        isOpen={!!inspectStudent}
        onClose={() => setInspectStudent(null)}
        title="Student Profile & Academic Records"
        description="Comprehensive submission and grade history"
        maxWidth="2xl"
        footer={
          <Button variant="outline" size="sm" onClick={() => setInspectStudent(null)}>
            Close
          </Button>
        }
      >
        {inspectStudent && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={inspectStudent.avatar}
                alt={inspectStudent.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectStudent.name}</h3>
                <p className="text-xs font-mono text-indigo-700 mt-0.5">{inspectStudent.matricNumber}</p>
                <p className="text-xs text-slate-500">{inspectStudent.email} • {inspectStudent.department}</p>
              </div>
            </div>

            {/* Past Submissions History */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Submission & Grade History
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {submissions
                  .filter(s => s.studentId === inspectStudent.id)
                  .map(sub => {
                    const asg = assignments.find(a => a.id === sub.assignmentId);
                    const crs = courses.find(c => c.id === sub.courseId);
                    return (
                      <div key={sub.id} className="p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{asg?.title}</span>
                            <span className="font-mono text-slate-500 text-[10px]">{crs?.code}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Submitted: {formatDateTime(sub.submittedAt)}</p>
                          {sub.studentFeedback && (
                            <p className="text-[11px] text-indigo-700 mt-1 italic">Feedback: "{sub.studentFeedback}"</p>
                          )}
                        </div>
                        <div className="text-right">
                          {sub.score !== undefined ? (
                            <span className="font-bold text-sm text-emerald-700">{sub.score} / {asg?.totalMarks}</span>
                          ) : (
                            <span className="text-amber-700 font-medium">Pending Grade</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal Before Removing Student */}
      <Modal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        title="Remove Student?"
        description="This will remove the student from enrolled courses."
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setStudentToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (studentToDelete) {
                  removeStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }
              }}
            >
              Remove Student
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to remove <strong className="text-slate-900">{studentToDelete?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
};
