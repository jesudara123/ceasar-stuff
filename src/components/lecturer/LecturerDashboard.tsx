import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  BookOpen,
  Users,
  FileCheck2,
  Inbox,
  Clock,
  AlertTriangle,
  PlusCircle,
  Megaphone,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { formatRelativeDeadline, formatDateTime } from '../../utils/formatters';

interface LecturerDashboardProps {
  onOpenCreateCourse: () => void;
  onOpenAddStudent: () => void;
  onOpenCreateAnnouncement: () => void;
}

export const LecturerDashboard: React.FC<LecturerDashboardProps> = ({
  onOpenCreateCourse,
  onOpenAddStudent,
  onOpenCreateAnnouncement
}) => {
  const {
    currentUser,
    courses,
    students,
    assignments,
    submissions,
    announcements,
    setCurrentTab,
    setSelectedCourseId,
    setSelectedAssignmentId,
    setSelectedSubmissionId,
    setSelectedStudentId
  } = useApp();

  // Metrics computation
  const totalCourses = courses.length;
  const totalStudents = students.length;
  const activeAssignments = assignments.filter(a => a.status === 'published').length;

  // Pending grading: submissions with status 'submitted' or 'late'
  const submissionsToGrade = submissions.filter(s => s.status === 'submitted' || s.status === 'late');
  const toGradeCount = submissionsToGrade.length;

  // Pending submissions (expected vs received)
  const totalExpected = activeAssignments * totalStudents;
  const totalReceived = submissions.length;
  const pendingSubmissionsCount = Math.max(0, totalExpected - totalReceived);

  // Overdue / closed assignments
  const overdueCount = assignments.filter(a => {
    const deadline = new Date(`${a.dueDate}T${a.dueTime || '23:59'}:00`);
    return deadline < new Date() || a.status === 'closed';
  }).length;

  // Late submissions
  const lateSubmissions = submissions.filter(s => s.status === 'late');

  // Assignments due soon (due in next 5 days and active)
  const dueSoonAssignments = assignments
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {greeting}, {currentUser.name.startsWith('Prof') ? currentUser.name : `Professor ${currentUser.name}`}
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Faculty Lead
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Here's what needs your attention today across your university courses and assignments.
          </p>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setCurrentTab('create_assignment')}
          >
            Create Assignment
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<BookOpen className="w-4 h-4" />}
            onClick={onOpenCreateCourse}
          >
            Create Course
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Users className="w-4 h-4" />}
            onClick={onOpenAddStudent}
          >
            Add Student
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Megaphone className="w-4 h-4" />}
            onClick={onOpenCreateAnnouncement}
          >
            Announcement
          </Button>
        </div>
      </div>

      {/* 6 Clickable Metric Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Courses */}
        <div
          onClick={() => setCurrentTab('courses')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight">Total Courses</span>
            <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            {totalCourses}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Active semester</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
          </p>
        </div>

        {/* Total Students */}
        <div
          onClick={() => setCurrentTab('students')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight">Total Students</span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            {totalStudents}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Enrolled learners</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
          </p>
        </div>

        {/* Active Assignments */}
        <div
          onClick={() => setCurrentTab('assignments')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight">Active Assignments</span>
            <FileCheck2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            {activeAssignments}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>In progress</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
          </p>
        </div>

        {/* Pending Submissions */}
        <div
          onClick={() => setCurrentTab('submissions')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight">Total Received</span>
            <Inbox className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-blue-600 tracking-tight">
            {totalReceived}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>All submissions</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
          </p>
        </div>

        {/* Submissions to Grade */}
        <div
          onClick={() => setCurrentTab('submissions')}
          className="bg-white p-4 rounded-xl border-2 border-amber-300/90 bg-amber-50/20 shadow-xs hover:border-amber-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold tracking-tight">To Grade</span>
            <Clock className="w-4 h-4 text-amber-600 group-hover:rotate-45 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-700 tracking-tight">
            {toGradeCount}
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <span>Requires evaluation</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
          </p>
        </div>

        {/* Overdue / Closed */}
        <div
          onClick={() => setCurrentTab('assignments')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold tracking-tight">Overdue/Past</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-600 tracking-tight">
            {overdueCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Closed tasks</span>
            <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
          </p>
        </div>
      </div>

      {/* DASHBOARD PRIORITY: Section 32 - What requires immediate attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Actionable Urgent Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Submissions waiting for grading */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  Submissions Requiring Your Grading
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                  {submissionsToGrade.length}
                </span>
              </div>
              <button
                onClick={() => setCurrentTab('submissions')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all submissions <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {submissionsToGrade.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  All caught up! No submissions waiting for your grading right now.
                </div>
              ) : (
                submissionsToGrade.slice(0, 4).map(sub => {
                  const student = students.find(s => s.id === sub.studentId);
                  const asg = assignments.find(a => a.id === sub.assignmentId);
                  const course = courses.find(c => c.id === sub.courseId);

                  return (
                    <div
                      key={sub.id}
                      className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={student?.avatar}
                          alt={student?.name}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {student?.name || 'Student'}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              ({student?.matricNumber})
                            </span>
                            {sub.status === 'late' && (
                              <Badge variant="danger" size="sm">LATE</Badge>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-700 mt-0.5">
                            {course?.code} — <span className="text-indigo-600">{asg?.title}</span>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Submitted on {formatDateTime(sub.submittedAt)} • {sub.files.length} file{sub.files.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedSubmissionId(sub.id);
                            setCurrentTab('grading');
                          }}
                        >
                          Grade Now
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Assignments Due Soon */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                  Assignments Due Soon
                </h3>
              </div>
              <button
                onClick={() => setCurrentTab('assignments')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all assignments <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {dueSoonAssignments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No upcoming deadlines in the next few days.
                </div>
              ) : (
                dueSoonAssignments.map(asg => {
                  const course = courses.find(c => c.id === asg.courseId);
                  const enrolledCount = course?.enrolledStudentIds.length || 0;
                  const asgSubmissions = submissions.filter(s => s.assignmentId === asg.id);
                  const countdown = formatRelativeDeadline(asg.dueDate, asg.dueTime);

                  const submissionPct = enrolledCount > 0 ? Math.round((asgSubmissions.length / enrolledCount) * 100) : 0;

                  return (
                    <div key={asg.id} className="p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {course?.code}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 hover:text-indigo-600 cursor-pointer"
                              onClick={() => { setSelectedAssignmentId(asg.id); setCurrentTab('assignments'); }}>
                            {asg.title}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500">
                          Due: <span className="font-medium text-slate-700">{asg.dueDate} at {asg.dueTime}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                            countdown.urgency === 'critical'
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : countdown.urgency === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {countdown.text}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                            {asgSubmissions.length} of {enrolledCount} submitted ({submissionPct}%)
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
                          Details
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Announcements & Class Performance Highlights */}
        <div className="space-y-6">
          {/* Recent Announcements Widget */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">Broadcasts</h3>
              </div>
              <button
                onClick={() => setCurrentTab('announcements')}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                All
              </button>
            </div>
            <div className="p-4 space-y-3">
              {announcements.slice(0, 3).map(ann => (
                <div key={ann.id} className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/30">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{ann.title}</span>
                    {ann.isUrgent && <Badge variant="danger" size="sm">Urgent</Badge>}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {ann.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block">
                    {formatDateTime(ann.publishDate)}
                  </span>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={onOpenCreateAnnouncement}
              >
                + Post Announcement
              </Button>
            </div>
          </div>

          {/* Quick Course Breakdown Cards */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Your Courses
              </h3>
              <button
                onClick={() => setCurrentTab('courses')}
                className="text-xs text-indigo-600 hover:underline font-medium"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {courses.map(course => {
                const courseAssignments = assignments.filter(a => a.courseId === course.id);
                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setCurrentTab('course_detail');
                    }}
                    className="p-3 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 cursor-pointer transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {course.code}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 mt-1 truncate max-w-[170px]">
                        {course.name}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <p className="font-medium text-slate-700">{course.enrolledStudentIds.length} students</p>
                      <p>{courseAssignments.length} assignments</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
