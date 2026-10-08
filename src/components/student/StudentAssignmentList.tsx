import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  FileCheck2,
  Clock,
  Search,
  BookOpen,
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  RotateCcw
} from 'lucide-react';
import { formatRelativeDeadline, formatDateTime } from '../../utils/formatters';

export const StudentAssignmentList: React.FC = () => {
  const {
    currentUser,
    courses,
    assignments,
    submissions,
    setCurrentTab,
    setSelectedAssignmentId
  } = useApp();

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'submitted' | 'graded'>('all');

  // Enrolled courses
  const studentCourses = courses.filter(c => c.enrolledStudentIds.includes(currentUser.id));

  // Coursework applicable to this student
  const studentAssignments = useMemo(() => {
    return assignments.filter(a =>
      studentCourses.some(c => c.id === a.courseId) && a.status !== 'draft'
    );
  }, [assignments, studentCourses]);

  // Submission map
  const submissionMap = useMemo(() => {
    const map = new Map<string, any>();
    submissions
      .filter(s => s.studentId === currentUser.id)
      .forEach(s => map.set(s.assignmentId, s));
    return map;
  }, [submissions, currentUser.id]);

  // Enriched rows
  const enrichedAssignments = useMemo(() => {
    return studentAssignments.map(asg => {
      const course = courses.find(c => c.id === asg.courseId);
      const sub = submissionMap.get(asg.id);
      const countdown = formatRelativeDeadline(asg.dueDate, asg.dueTime);

      let state: 'todo' | 'submitted' | 'graded' | 'late' = 'todo';
      if (sub) {
        if (sub.score !== undefined && (sub.isReturned || sub.status === 'returned')) {
          state = 'graded';
        } else if (sub.status === 'late') {
          state = 'late';
        } else {
          state = 'submitted';
        }
      }

      return {
        ...asg,
        course,
        submission: sub,
        countdown,
        state
      };
    });
  }, [studentAssignments, courses, submissionMap]);

  // Filtered
  const filtered = useMemo(() => {
    return enrichedAssignments.filter(item => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        (item.course?.code || '').toLowerCase().includes(q) ||
        (item.course?.name || '').toLowerCase().includes(q);

      const matchesCourse = courseFilter === 'all' || item.courseId === courseFilter;

      let matchesStatus = true;
      if (statusFilter === 'todo') {
        matchesStatus = !item.submission;
      } else if (statusFilter === 'submitted') {
        matchesStatus = !!item.submission && item.submission.score === undefined;
      } else if (statusFilter === 'graded') {
        matchesStatus = !!item.submission && item.submission.score !== undefined;
      }

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [enrichedAssignments, search, courseFilter, statusFilter]);

  const handleOpenAssignment = (id: string) => {
    setSelectedAssignmentId(id);
    setCurrentTab('assignment_detail');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Coursework & Assignments</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Submit coursework solutions, review guidelines, and track grading returns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            {studentAssignments.length} Assignments Enrolled
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assignments or course code..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['all', 'todo', 'submitted', 'graded'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all capitalize ${
                  statusFilter === tab
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'todo' ? 'To Do' : tab}
              </button>
            ))}
          </div>

          {/* Course select */}
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All My Courses</option>
            {studentCourses.map(c => (
              <option key={c.id} value={c.id}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
            <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No assignments found</h3>
            <p className="text-xs text-slate-400 mt-1">There are no assignments matching your filter.</p>
          </div>
        ) : (
          filtered.map(asg => {
            const hasSub = !!asg.submission;
            const isGraded = hasSub && asg.submission.score !== undefined;

            return (
              <div
                key={asg.id}
                className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {asg.course?.code}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {asg.course?.name}
                    </span>
                    {isGraded ? (
                      <Badge variant="success" size="sm">Graded</Badge>
                    ) : hasSub ? (
                      <Badge variant="primary" size="sm">Turned In</Badge>
                    ) : (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        asg.countdown.urgency === 'critical'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : asg.countdown.urgency === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : asg.countdown.urgency === 'past'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {asg.countdown.text}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => handleOpenAssignment(asg.id)}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                  >
                    {asg.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>Due: <strong className="text-slate-700">{asg.dueDate} at {asg.dueTime}</strong></span>
                    <span>•</span>
                    <span>Total Marks: <strong className="text-slate-700">{asg.totalMarks}</strong></span>
                    <span>•</span>
                    <span>Formats: <strong className="text-slate-700">{asg.allowedFileTypes.join(', ')}</strong></span>
                  </div>
                </div>

                {/* Right Action & Status Badge */}
                <div className="flex flex-col sm:flex-row md:flex-col items-end justify-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {isGraded ? (
                    <div className="text-right">
                      <span className="text-xl font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 block">
                        {asg.submission.score} / {asg.totalMarks}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => handleOpenAssignment(asg.id)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        View Grade & Feedback
                      </Button>
                    </div>
                  ) : hasSub ? (
                    <div className="text-right">
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded block">
                        Submitted: {formatDateTime(asg.submission.submittedAt)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => handleOpenAssignment(asg.id)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        View / Revise Submission
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleOpenAssignment(asg.id)}
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Write / Submit Assignment
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
