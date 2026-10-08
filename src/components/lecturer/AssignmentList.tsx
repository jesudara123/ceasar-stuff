import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Assignment, AssignmentStatus } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  FileCheck2,
  Plus,
  Search,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ExternalLink,
  SlidersHorizontal,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpDown,
  Filter,
  Pencil
} from 'lucide-react';
import { formatRelativeDeadline, formatDate } from '../../utils/formatters';

export const AssignmentList: React.FC = () => {
  const {
    assignments,
    courses,
    submissions,
    deleteAssignment,
    duplicateAssignment,
    toggleAssignmentStatus,
    setCurrentTab,
    setSelectedAssignmentId,
    setSelectedSubmissionId
  } = useApp();

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'newest' | 'oldest'>('dueDate');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);

  // Compute enriched assignments with accurate submission/grading counts and statuses
  const processedAssignments = useMemo(() => {
    return assignments.map(asg => {
      const course = courses.find(c => c.id === asg.courseId);
      const asgSubmissions = submissions.filter(s => s.assignmentId === asg.id);
      const graded = asgSubmissions.filter(s => s.status === 'graded' || s.status === 'returned').length;
      const pending = asgSubmissions.filter(s => s.status === 'submitted' || s.status === 'late').length;

      // Deadline check
      const deadline = new Date(`${asg.dueDate}T${asg.dueTime || '23:59'}:00`);
      const now = new Date();
      const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

      let computedStatus: string = asg.status;
      if (asg.status === 'published') {
        if (deadline < now) {
          computedStatus = 'overdue';
        } else if (diffHours <= 48) {
          computedStatus = 'due_soon';
        }
      }

      return {
        ...asg,
        course,
        submissionsCount: asgSubmissions.length,
        gradedCount: graded,
        pendingCount: pending,
        computedStatus,
      };
    });
  }, [assignments, courses, submissions]);

  const filtered = useMemo(() => {
    return processedAssignments
      .filter(a => {
        const matchesSearch =
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          (a.course?.code || '').toLowerCase().includes(search.toLowerCase());
        const matchesCourse = courseFilter === 'all' || a.courseId === courseFilter;
        const matchesStatus =
          statusFilter === 'all' ||
          a.computedStatus === statusFilter ||
          (statusFilter === 'published' && (a.status === 'published' || a.computedStatus === 'due_soon'));

        return matchesSearch && matchesCourse && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
  }, [processedAssignments, search, courseFilter, statusFilter, sortBy]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'due_soon':
        return <Badge variant="warning">Due Soon</Badge>;
      case 'published':
        return <Badge variant="primary">Published</Badge>;
      case 'draft':
        return <Badge variant="neutral">Draft</Badge>;
      case 'closed':
        return <Badge variant="neutral">Closed</Badge>;
      case 'overdue':
        return <Badge variant="danger">Overdue</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Assignments</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Monitor deadlines, submission volumes, and grading progress across all classes.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setCurrentTab('create_assignment')}
        >
          Create Assignment
        </Button>
      </div>

      {/* Filters bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search assignments..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Course filter */}
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

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="due_soon">Due Soon</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Sort order */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="newest">Sort by Newest</option>
            <option value="oldest">Sort by Oldest</option>
          </select>

          {/* View toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 text-xs font-semibold ${viewMode === 'table' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-2.5 py-1 text-xs font-semibold ${viewMode === 'cards' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No assignments found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            {search ? 'Try modifying your search or filters.' : 'Create your first assignment to get started.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => setCurrentTab('create_assignment')}
          >
            + Create Assignment
          </Button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Assignment</th>
                <th className="py-3 px-4">Course</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Submissions</th>
                <th className="py-3 px-4 text-center">Graded</th>
                <th className="py-3 px-4 text-center">To Grade</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(asg => {
                const countdown = formatRelativeDeadline(asg.dueDate, asg.dueTime);
                return (
                  <tr key={asg.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block text-sm hover:text-indigo-600 cursor-pointer"
                              onClick={() => { setSelectedAssignmentId(asg.id); setCurrentTab('submissions'); }}>
                          {asg.title}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5 block">
                          Total: {asg.totalMarks} marks • {asg.rubrics.length} rubric criteria
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[11px]">
                        {asg.course?.code || 'N/A'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">{asg.dueDate}</span>
                      <span className="text-[11px] text-slate-500 font-normal">{asg.dueTime || '23:59'}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {asg.submissionsCount}
                    </td>

                    <td className="py-3.5 px-4 text-center font-semibold text-emerald-700">
                      {asg.gradedCount}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded ${
                        asg.pendingCount > 0 ? 'bg-amber-100 text-amber-900' : 'text-slate-400'
                      }`}>
                        {asg.pendingCount}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {renderStatusBadge(asg.computedStatus)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs py-1 px-2"
                          onClick={() => {
                            setSelectedAssignmentId(asg.id);
                            setCurrentTab('submissions');
                          }}
                        >
                          Submissions
                        </Button>
                        <button
                          onClick={() => {
                            setSelectedAssignmentId(asg.id);
                            setCurrentTab('create_assignment');
                          }}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title="Edit Assignment"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateAssignment(asg.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          title="Duplicate Assignment"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleAssignmentStatus(asg.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                          title={asg.status === 'published' ? 'Close Assignment' : 'Reopen Assignment'}
                        >
                          {asg.status === 'published' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setAssignmentToDelete(asg)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Assignment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(asg => {
            const countdown = formatRelativeDeadline(asg.dueDate, asg.dueTime);
            return (
              <div key={asg.id} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                      {asg.course?.code}
                    </span>
                    {renderStatusBadge(asg.computedStatus)}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{asg.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{asg.description}</p>

                  <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-medium">Submissions</span>
                      <span className="text-sm font-bold text-slate-800">{asg.submissionsCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-medium">Graded</span>
                      <span className="text-sm font-bold text-emerald-600">{asg.gradedCount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-medium">To Grade</span>
                      <span className="text-sm font-bold text-amber-600">{asg.pendingCount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Due: {asg.dueDate}</span>
                    <span className="font-semibold text-slate-800">{asg.totalMarks} Marks</span>
                  </div>
                </div>

                <div className="pt-4 mt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setSelectedAssignmentId(asg.id);
                      setCurrentTab('submissions');
                    }}
                  >
                    Submissions
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setSelectedAssignmentId(asg.id);
                      setCurrentTab('create_assignment');
                    }}
                    leftIcon={<Pencil className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>
                  <button
                    onClick={() => setAssignmentToDelete(asg)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!assignmentToDelete}
        onClose={() => setAssignmentToDelete(null)}
        title="Delete Assignment?"
        description="This action cannot be undone."
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setAssignmentToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (assignmentToDelete) {
                  deleteAssignment(assignmentToDelete.id);
                  setAssignmentToDelete(null);
                }
              }}
            >
              Delete Assignment
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to permanently delete <strong className="text-slate-900">{assignmentToDelete?.title}</strong>? All associated student submissions and marks will be permanently cleared.
        </p>
      </Modal>
    </div>
  );
};
