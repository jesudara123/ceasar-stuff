import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { AddStudentModal } from './AddStudentModal';
import {
  ArrowLeft,
  BookOpen,
  FileCheck2,
  Users,
  GraduationCap,
  Megaphone,
  Plus,
  UserPlus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink,
  Search,
  Check,
  X
} from 'lucide-react';
import { formatRelativeDeadline, formatDateTime } from '../../utils/formatters';

interface CourseDetailProps {
  onOpenCreateAssignment: () => void;
  onOpenCreateAnnouncement: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({
  onOpenCreateAssignment,
  onOpenCreateAnnouncement
}) => {
  const {
    courses,
    selectedCourseId,
    setCurrentTab,
    setSelectedCourseId,
    assignments,
    submissions,
    students,
    announcements,
    enrollStudentInCourse,
    unenrollStudentFromCourse,
    setSelectedAssignmentId,
    setSelectedSubmissionId
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'assignments' | 'students' | 'grades' | 'announcements'>('overview');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isAddNewStudentModalOpen, setIsAddNewStudentModalOpen] = useState(false);
  const [studentToEnroll, setStudentToEnroll] = useState('');

  const course = courses.find(c => c.id === selectedCourseId);

  if (!course) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-600">Course not found.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => setCurrentTab('courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  const courseAssignments = assignments.filter(a => a.courseId === course.id);
  const enrolledStudents = students.filter(s => course.enrolledStudentIds.includes(s.id));
  const unenrolledStudents = students.filter(s => !course.enrolledStudentIds.includes(s.id));
  const courseAnnouncements = announcements.filter(a => a.courseId === course.id || a.courseId === 'all');

  const handleEnroll = () => {
    if (studentToEnroll) {
      enrollStudentInCourse(course.id, studentToEnroll);
      setStudentToEnroll('');
      setIsEnrollModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Back button and breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => { setSelectedCourseId(null); setCurrentTab('courses'); }}
          className="flex items-center gap-1 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </button>
        <span>/</span>
        <span className="font-semibold text-slate-900">{course.code}</span>
      </div>

      {/* Course Hero Banner */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${course.color || '#3b82f6'} 0%, #1e1b4b 100%)`
        }}
      >
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wider">
              {course.code}
            </span>
            <span className="bg-black/20 backdrop-blur-md px-2.5 py-0.5 rounded text-xs font-medium">
              {course.level}
            </span>
            <span className="bg-black/20 backdrop-blur-md px-2.5 py-0.5 rounded text-xs font-medium">
              {course.semester} • {course.session}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {course.name}
          </h1>
          <p className="text-sm text-white/80 mt-2 max-w-2xl leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-white/10 text-xs font-medium">
            <div>
              <span className="text-white/60 block text-[11px]">Enrolled Students</span>
              <span className="text-lg font-bold">{enrolledStudents.length}</span>
            </div>
            <div>
              <span className="text-white/60 block text-[11px]">Course Assignments</span>
              <span className="text-lg font-bold">{courseAssignments.length}</span>
            </div>
            <div>
              <span className="text-white/60 block text-[11px]">Department</span>
              <span className="text-sm font-semibold">{course.department}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation for Course Page */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'assignments', label: `Assignments (${courseAssignments.length})`, icon: FileCheck2 },
            { id: 'students', label: `Students (${enrolledStudents.length})`, icon: Users },
            { id: 'grades', label: 'Marksheet & Grades', icon: GraduationCap },
            { id: 'announcements', label: `Announcements (${courseAnnouncements.length})`, icon: Megaphone },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`py-3 px-1 inline-flex items-center gap-2 border-b-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Contents */}

      {/* 1. OVERVIEW TAB */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-3">Course Syllabus & Objectives</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {course.description}
              </p>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Grading Scheme</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600">
                  <div>
                    <span className="font-semibold block text-slate-900">Assignments & Labs</span>
                    <span>40% of Total</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-900">Mid-Semester Exam</span>
                    <span>20% of Total</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-900">Final Examination</span>
                    <span>30% of Total</span>
                  </div>
                  <div>
                    <span className="font-semibold block text-slate-900">Participation</span>
                    <span>10% of Total</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Active Course Tasks</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveSubTab('assignments')}>
                  View all
                </Button>
              </div>
              <div className="space-y-3">
                {courseAssignments.slice(0, 3).map(asg => (
                  <div key={asg.id} className="p-3.5 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{asg.title}</p>
                      <p className="text-xs text-slate-500">Due: {asg.dueDate} • {asg.totalMarks} marks</p>
                    </div>
                    <Badge variant={asg.status === 'published' ? 'primary' : 'neutral'} size="sm">
                      {asg.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Course Management Quick Links</h3>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={onOpenCreateAssignment}
                >
                  Create New Assignment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<UserPlus className="w-4 h-4" />}
                  onClick={() => setIsEnrollModalOpen(true)}
                >
                  Enroll Student
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<Megaphone className="w-4 h-4" />}
                  onClick={onOpenCreateAnnouncement}
                >
                  Broadcast Announcement
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ASSIGNMENTS TAB */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Course Assignments</h3>
              <p className="text-xs text-slate-500">Track and manage assignments created for {course.code}</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onOpenCreateAssignment}
            >
              New Assignment
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs divide-y divide-slate-100">
            {courseAssignments.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No assignments created for this course yet.
              </div>
            ) : (
              courseAssignments.map(asg => {
                const asgSubmissions = submissions.filter(s => s.assignmentId === asg.id);
                const toGrade = asgSubmissions.filter(s => s.status === 'submitted' || s.status === 'late').length;
                const countdown = formatRelativeDeadline(asg.dueDate, asg.dueTime);

                return (
                  <div key={asg.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{asg.title}</h4>
                        <Badge variant={asg.status === 'published' ? 'primary' : 'neutral'} size="sm">
                          {asg.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{asg.description}</p>
                      <p className="text-xs text-slate-400">
                        Due: {asg.dueDate} at {asg.dueTime} • {asg.totalMarks} Marks • {asg.rubrics.length} Rubric Criteria
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs">
                        <span className={`inline-block font-bold px-2 py-0.5 rounded-full ${
                          countdown.urgency === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {countdown.text}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {asgSubmissions.length} Submitted • <strong className="text-amber-700">{toGrade} To Grade</strong>
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAssignmentId(asg.id);
                          setCurrentTab('assignments');
                        }}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 3. STUDENTS TAB */}
      {activeSubTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Enrolled Students ({enrolledStudents.length})</h3>
              <p className="text-xs text-slate-500">Students registered in this section</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<UserPlus className="w-4 h-4" />}
                onClick={() => setIsEnrollModalOpen(true)}
              >
                Enroll Existing ({unenrolledStudents.length} available)
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setIsAddNewStudentModalOpen(true)}
              >
                + Add New Student
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Matric Number</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Submissions</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledStudents.map(student => {
                  const studentSubs = submissions.filter(
                    s => s.studentId === student.id && s.courseId === course.id
                  );
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2.5">
                        <img src={student.avatar} alt={student.name} className="w-7 h-7 rounded-full object-cover" />
                        <span>{student.name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{student.matricNumber}</td>
                      <td className="py-3.5 px-4 text-slate-500">{student.email}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {studentSubs.length} of {courseAssignments.length} submitted
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => unenrollStudentFromCourse(course.id, student.id)}
                          className="text-rose-600 hover:text-rose-800 font-medium hover:underline text-xs"
                        >
                          Unenroll
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. GRADES / MARKSHEET TAB */}
      {activeSubTab === 'grades' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Course Marksheet Matrix</h3>
              <p className="text-xs text-slate-500">Continuous assessment scores and overall tally</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 sticky left-0 bg-slate-50 z-10">Student</th>
                  <th className="py-3 px-4">Matric No</th>
                  {courseAssignments.map(a => (
                    <th key={a.id} className="py-3 px-4 text-center">
                      <span className="block truncate max-w-[120px]" title={a.title}>{a.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">Max: {a.totalMarks}</span>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right font-bold">Total / 100%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledStudents.map(student => {
                  let totalObtained = 0;
                  let totalPossible = 0;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900 sticky left-0 bg-white">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">{student.matricNumber}</td>

                      {courseAssignments.map(a => {
                        const sub = submissions.find(s => s.assignmentId === a.id && s.studentId === student.id);
                        if (sub && sub.score !== undefined) {
                          totalObtained += sub.score;
                          totalPossible += a.totalMarks;
                          return (
                            <td key={a.id} className="py-3 px-4 text-center">
                              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                {sub.score}
                              </span>
                            </td>
                          );
                        } else if (sub) {
                          totalPossible += a.totalMarks;
                          return (
                            <td key={a.id} className="py-3 px-4 text-center">
                              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium text-[11px]">
                                Submitted
                              </span>
                            </td>
                          );
                        } else {
                          totalPossible += a.totalMarks;
                          return (
                            <td key={a.id} className="py-3 px-4 text-center text-slate-400">
                              —
                            </td>
                          );
                        }
                      })}

                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {totalPossible > 0 ? `${Math.round((totalObtained / totalPossible) * 100)}%` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ANNOUNCEMENTS TAB */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Course Broadcasts</h3>
              <p className="text-xs text-slate-500">Announcements displayed to students enrolled in {course.code}</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onOpenCreateAnnouncement}
            >
              Post Announcement
            </Button>
          </div>

          <div className="space-y-3">
            {courseAnnouncements.map(ann => (
              <div key={ann.id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{ann.title}</h4>
                    {ann.isUrgent && <Badge variant="danger" size="sm">Urgent</Badge>}
                  </div>
                  <span className="text-xs text-slate-400">{formatDateTime(ann.publishDate)}</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{ann.message}</p>
                <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
                  <span>Author: {ann.authorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title={`Enroll Student in ${course.code}`}
        description="Select a student to grant course access"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleEnroll} disabled={!studentToEnroll}>
              Enroll Student
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {unenrolledStudents.length === 0 ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-slate-600">All registered students are currently enrolled in {course.code}.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsEnrollModalOpen(false);
                  setIsAddNewStudentModalOpen(true);
                }}
              >
                + Register & Add New Student
              </Button>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Available Students
              </label>
              <select
                value={studentToEnroll}
                onChange={e => setStudentToEnroll(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Select a student...</option>
                {unenrolledStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.matricNumber || s.email})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Modal>

      {/* Direct Add & Enroll New Student Modal */}
      <AddStudentModal
        isOpen={isAddNewStudentModalOpen}
        onClose={() => setIsAddNewStudentModalOpen(false)}
        preselectedCourseId={course.id}
      />
    </div>
  );
};
