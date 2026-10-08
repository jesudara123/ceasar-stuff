import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Submission, SubmissionStatus } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export const SubmissionManagement: React.FC = () => {
  const {
    submissions,
    assignments,
    courses,
    students,
    selectedAssignmentId,
    setSelectedAssignmentId,
    setSelectedSubmissionId,
    setCurrentTab
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'graded' | 'late' | 'missing'>('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // Compute all potential submission rows (including Missing/Not Submitted students)
  const fullSubmissionsMatrix = useMemo(() => {
    const list: Array<{
      id: string;
      submission?: Submission;
      student: any;
      assignment: any;
      course: any;
      submittedAt?: string;
      status: 'not_submitted' | 'submitted' | 'late' | 'graded' | 'returned';
      score?: number;
      maxScore?: number;
      feedback?: string;
    }> = [];

    // Filter assignments by course if course filter selected
    const targetAssignments = assignments.filter(a => {
      if (selectedAssignmentId && a.id !== selectedAssignmentId) return false;
      if (courseFilter !== 'all' && a.courseId !== courseFilter) return false;
      return a.status !== 'draft';
    });

    targetAssignments.forEach(asg => {
      const course = courses.find(c => c.id === asg.courseId);
      const enrolledStudents = students.filter(s => course?.enrolledStudentIds.includes(s.id));

      enrolledStudents.forEach(st => {
        const sub = submissions.find(s => s.assignmentId === asg.id && s.studentId === st.id);

        if (sub) {
          list.push({
            id: sub.id,
            submission: sub,
            student: st,
            assignment: asg,
            course,
            submittedAt: sub.submittedAt,
            status: sub.status,
            score: sub.score,
            maxScore: asg.totalMarks,
            feedback: sub.studentFeedback
          });
        } else {
          // Missing / Not submitted
          list.push({
            id: `missing_${asg.id}_${st.id}`,
            student: st,
            assignment: asg,
            course,
            status: 'not_submitted',
            maxScore: asg.totalMarks
          });
        }
      });
    });

    return list;
  }, [assignments, courses, students, submissions, selectedAssignmentId, courseFilter]);

  // Overall metric counts
  const totalSubmissions = submissions.length;
  const pendingGradingCount = submissions.filter(s => s.status === 'submitted' || s.status === 'late').length;
  const gradedCount = submissions.filter(s => s.status === 'graded' || s.status === 'returned').length;
  const lateCount = submissions.filter(s => s.status === 'late').length;
  const missingCount = fullSubmissionsMatrix.filter(item => item.status === 'not_submitted').length;

  // Filtered rows
  const filteredItems = useMemo(() => {
    return fullSubmissionsMatrix.filter(item => {
      // Search
      const q = search.toLowerCase();
      const matchesSearch =
        item.student.name.toLowerCase().includes(q) ||
        (item.student.matricNumber && item.student.matricNumber.toLowerCase().includes(q)) ||
        item.assignment.title.toLowerCase().includes(q);

      // Status filter
      let matchesStatus = true;
      if (statusFilter === 'pending') {
        matchesStatus = item.status === 'submitted' || item.status === 'late';
      } else if (statusFilter === 'graded') {
        matchesStatus = item.status === 'graded' || item.status === 'returned';
      } else if (statusFilter === 'late') {
        matchesStatus = item.status === 'late';
      } else if (statusFilter === 'missing') {
        matchesStatus = item.status === 'not_submitted';
      }

      return matchesSearch && matchesStatus;
    });
  }, [fullSubmissionsMatrix, search, statusFilter]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="warning">Submitted (To Grade)</Badge>;
      case 'late':
        return <Badge variant="danger">Late Submission</Badge>;
      case 'graded':
        return <Badge variant="purple">Graded (Draft)</Badge>;
      case 'returned':
        return <Badge variant="success">Returned to Student</Badge>;
      case 'not_submitted':
        return <Badge variant="neutral">Not Submitted</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const handleOpenGrading = (subId?: string) => {
    if (subId && !subId.startsWith('missing_')) {
      setSelectedSubmissionId(subId);
      setCurrentTab('grading');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Submission Management</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Audit student uploads, evaluate criteria against rubrics, and release feedback.
          </p>
        </div>

        {selectedAssignmentId && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filtered by:</span>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              {assignments.find(a => a.id === selectedAssignmentId)?.title}
            </span>
            <button
              onClick={() => setSelectedAssignmentId(null)}
              className="text-xs text-slate-400 hover:text-slate-700 hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* 5 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all ${
            statusFilter === 'all' ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 block">Total Submissions</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalSubmissions}</span>
          <span className="text-[11px] text-slate-400">Received uploads</span>
        </div>

        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-xl border bg-amber-50/40 cursor-pointer transition-all ${
            statusFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-amber-200 hover:border-amber-300'
          }`}
        >
          <span className="text-xs font-bold text-amber-800 block">Pending Grading</span>
          <span className="text-2xl font-bold text-amber-700 mt-1 block">{pendingGradingCount}</span>
          <span className="text-[11px] text-amber-600 font-medium">Requires review</span>
        </div>

        <div
          onClick={() => setStatusFilter('graded')}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all ${
            statusFilter === 'graded' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 block">Graded Work</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">{gradedCount}</span>
          <span className="text-[11px] text-slate-400">Completed grades</span>
        </div>

        <div
          onClick={() => setStatusFilter('late')}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all ${
            statusFilter === 'late' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 block">Late Submissions</span>
          <span className="text-2xl font-bold text-rose-600 mt-1 block">{lateCount}</span>
          <span className="text-[11px] text-slate-400">Subject to penalty</span>
        </div>

        <div
          onClick={() => setStatusFilter('missing')}
          className={`p-4 rounded-xl border bg-white cursor-pointer transition-all ${
            statusFilter === 'missing' ? 'border-slate-500 ring-2 ring-slate-500/20' : 'border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-semibold text-slate-500 block">Missing Submissions</span>
          <span className="text-2xl font-bold text-slate-500 mt-1 block">{missingCount}</span>
          <span className="text-[11px] text-slate-400">Unsubmitted work</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search student name or matric number..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status filter buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['all', 'pending', 'graded', 'late', 'missing'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all capitalize ${
                  statusFilter === tab
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Course dropdown */}
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            No submissions matched your filter.
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Assignment</th>
                <th className="py-3 px-4">Submitted At</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Feedback</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(row => {
                const isMissing = row.status === 'not_submitted';

                return (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student Column */}
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.student.avatar}
                          alt={row.student.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">
                            {row.student.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {row.student.matricNumber}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Assignment Column */}
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-800 block text-xs">
                          {row.assignment.title}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded inline-block mt-0.5">
                          {row.course?.code}
                        </span>
                      </div>
                    </td>

                    {/* Submitted At */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {row.submittedAt ? (
                        <span>{formatDateTime(row.submittedAt)}</span>
                      ) : (
                        <span className="text-slate-400 italic">Not submitted</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(row.status)}
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4 text-center">
                      {row.score !== undefined ? (
                        <span className="font-bold text-sm text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                          {row.score} / {row.maxScore}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Feedback Preview */}
                    <td className="py-3.5 px-4 max-w-xs">
                      {row.feedback ? (
                        <p className="text-slate-600 truncate text-[11px]" title={row.feedback}>
                          "{row.feedback}"
                        </p>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">No feedback yet</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {isMissing ? (
                        <span className="text-slate-400 text-xs italic">Awaiting submission</span>
                      ) : (
                        <Button
                          variant={row.status === 'submitted' || row.status === 'late' ? 'primary' : 'outline'}
                          size="sm"
                          className="text-xs py-1"
                          onClick={() => handleOpenGrading(row.id)}
                        >
                          {row.status === 'submitted' || row.status === 'late' ? 'Grade Work' : 'Review Grade'}
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
