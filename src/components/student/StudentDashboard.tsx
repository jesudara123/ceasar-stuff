import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  FileCheck2,
  Clock,
  BookOpen,
  GraduationCap,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  UploadCloud,
  Megaphone,
  Sparkles
} from 'lucide-react';
import { formatRelativeDeadline, formatDateTime } from '../../utils/formatters';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    assignments,
    submissions,
    announcements,
    setCurrentTab,
    setSelectedAssignmentId,
    setSelectedCourseId
  } = useApp();

  // Enrolled courses
  const studentCourses = courses.filter(c => c.enrolledStudentIds.includes(currentUser.id));

  // Applicable assignments
  const studentAssignments = assignments.filter(a =>
    studentCourses.some(c => c.id === a.courseId) && a.status !== 'draft'
  );

  // Student's submissions
  const studentSubmissions = submissions.filter(s => s.studentId === currentUser.id);

  // Submissions map
  const submissionMap = new Map(studentSubmissions.map(s => [s.assignmentId, s]));

  // Metrics: Due Today, Due This Week, Submitted, Missing
  const now = new Date();
  const todayStr = '2026-10-08'; // local current date

  let dueTodayCount = 0;
  let dueThisWeekCount = 0;
  let submittedCount = 0;
  let missingCount = 0;

  studentAssignments.forEach(asg => {
    const hasSubmitted = submissionMap.has(asg.id);
    const deadline = new Date(`${asg.dueDate}T${asg.dueTime || '23:59'}:00`);

    if (hasSubmitted) {
      submittedCount++;
    } else {
      if (deadline < now) {
        missingCount++;
      } else {
        const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (asg.dueDate === todayStr || diffDays <= 1) {
          dueTodayCount++;
        }
        if (diffDays <= 7) {
          dueThisWeekCount++;
        }
      }
    }
  });

  // Upcoming assignments sorted by due date
  const upcomingAssignments = studentAssignments
    .filter(a => !submissionMap.has(a.id) && new Date(`${a.dueDate}T${a.dueTime || '23:59'}:00`) >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Recently graded work
  const recentlyGraded = studentSubmissions
    .filter(s => s.score !== undefined && (s.isReturned || s.status === 'returned'))
    .sort((a, b) => new Date(b.gradedAt || '').getTime() - new Date(a.gradedAt || '').getTime());

  // Recent announcements for student
  const recentAnnouncements = announcements
    .filter(ann => ann.courseId === 'all' || studentCourses.some(c => c.id === ann.courseId))
    .slice(0, 3);

  const firstName = currentUser.name.split(' ')[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, {firstName}
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
              {currentUser.matricNumber}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Track your semester coursework, submit project deliverables, and review lecturer feedback.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedAssignmentId(null);
              setCurrentTab('assignments');
            }}
            leftIcon={<FileCheck2 className="w-4 h-4" />}
          >
            View All Assignments
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setCurrentTab('grades')}
            leftIcon={<GraduationCap className="w-4 h-4" />}
          >
            My Grades
          </Button>
        </div>
      </div>

      {/* 4 Cards: Due Today | Due This Week | Submitted | Missing */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Due Today</span>
            <Clock className={`w-4 h-4 ${dueTodayCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-bold ${dueTodayCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {dueTodayCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {dueTodayCount > 0 ? 'Urgent deadlines today' : 'No deadlines today'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Due This Week</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dueThisWeekCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Next 7 calendar days</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Submitted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {submittedCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Turned in deliverables</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Missing</span>
            <AlertCircle className={`w-4 h-4 ${missingCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-bold ${missingCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {missingCount}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {missingCount > 0 ? 'Past deadline unsubmitted' : 'All up to date'}
          </p>
        </div>
      </div>

      {/* Main 2-Column Split: Upcoming Deadlines & Current Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Upcoming Assignments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  Upcoming Course Assignments
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('assignments')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {upcomingAssignments.length === 0 ? (
                <div className="py-10 text-center text-slate-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  Great job! You have no pending assignments waiting for submission.
                </div>
              ) : (
                upcomingAssignments.map(asg => {
                  const course = courses.find(c => c.id === asg.courseId);
                  const countdown = formatRelativeDeadline(asg.dueDate, asg.dueTime);

                  return (
                    <div
                      key={asg.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                            {course?.code}
                          </span>
                          <h4
                            onClick={() => {
                              setSelectedAssignmentId(asg.id);
                              setCurrentTab('assignment_detail');
                            }}
                            className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                          >
                            {asg.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1">{asg.description}</p>
                        <p className="text-[11px] text-slate-400">
                          Due: {asg.dueDate} at {asg.dueTime} • Total: {asg.totalMarks} marks
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          countdown.urgency === 'critical'
                            ? 'bg-rose-100 text-rose-800 animate-pulse'
                            : countdown.urgency === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {countdown.text}
                        </span>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedAssignmentId(asg.id);
                            setCurrentTab('assignment_detail');
                          }}
                        >
                          Submit Work
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recently Graded Work with Lecturer Feedback */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  Recently Graded Work & Feedback
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('grades')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                All grades <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentlyGraded.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No graded submissions returned yet.
                </div>
              ) : (
                recentlyGraded.slice(0, 3).map(sub => {
                  const asg = assignments.find(a => a.id === sub.assignmentId);
                  const course = courses.find(c => c.id === sub.courseId);

                  return (
                    <div key={sub.id} className="p-4 sm:p-5 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                              {course?.code}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{asg?.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Graded on {sub.gradedAt ? formatDateTime(sub.gradedAt) : 'Recently'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            {sub.score} / {asg?.totalMarks || 100}
                          </span>
                        </div>
                      </div>

                      {sub.studentFeedback && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                          <span className="font-bold text-slate-800 block mb-0.5">Lecturer Feedback:</span>
                          <p className="text-slate-600 italic">"{sub.studentFeedback}"</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Current Courses & Announcements */}
        <div className="space-y-6">
          {/* Current Courses */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Current Enrolled Courses
            </h3>

            <div className="space-y-3">
              {studentCourses.map(c => {
                const cAssignments = assignments.filter(a => a.courseId === c.id && a.status !== 'draft');
                const cSubmitted = studentSubmissions.filter(s => s.courseId === c.id);
                const pct = cAssignments.length > 0 ? Math.round((cSubmitted.length / cAssignments.length) * 100) : 100;

                return (
                  <div key={c.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{pct}% Complete</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{c.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.department}</p>

                    {/* Mini progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
                      <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <Megaphone className="w-4 h-4 text-indigo-600" /> Faculty Announcements
            </h3>

            <div className="space-y-3">
              {recentAnnouncements.map(ann => (
                <div key={ann.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/40 text-xs">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 truncate">{ann.title}</span>
                    {ann.isUrgent && <Badge variant="danger" size="sm">Urgent</Badge>}
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed">{ann.message}</p>
                  <span className="text-[10px] text-slate-400 mt-2 block">{formatDateTime(ann.publishDate)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
