import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  AlertTriangle,
  Search,
  CheckCircle2,
  Users,
  BookOpen
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

interface AnnouncementsViewProps {
  onOpenCreateModal: () => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ onOpenCreateModal }) => {
  const {
    currentUser,
    announcements,
    courses,
    deleteAnnouncement,
    markAnnouncementRead
  } = useApp();

  const isLecturer = currentUser.role === 'lecturer';
  const [courseFilter, setCourseFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = announcements.filter(ann => {
    const matchesCourse =
      courseFilter === 'all' ||
      ann.courseId === courseFilter ||
      ann.courseId === 'all';
    const matchesSearch =
      ann.title.toLowerCase().includes(search.toLowerCase()) ||
      ann.message.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Announcements</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Broadcast urgent deadlines, schedule changes, and academic notices.
          </p>
        </div>

        {isLecturer && (
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={onOpenCreateModal}
          >
            Post Announcement
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search announcement subject or text..."
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0">Audience:</span>
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Announcements</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
            <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-900">No announcements found</h3>
            <p className="text-xs text-slate-500 mt-1">There are no notices matching your filter criteria.</p>
          </div>
        ) : (
          filtered.map(ann => {
            const course = courses.find(c => c.id === ann.courseId);
            const isRead = ann.readByUserIds.includes(currentUser.id);

            return (
              <div
                key={ann.id}
                onClick={() => markAnnouncementRead(ann.id)}
                className={`bg-white rounded-xl border p-5 shadow-xs transition-all relative ${
                  ann.isUrgent ? 'border-l-4 border-l-rose-500 border-slate-200' : 'border-slate-200/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono">
                      {course ? course.code : 'All Courses'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                    {ann.isUrgent && <Badge variant="danger" size="sm">Urgent Notice</Badge>}
                    {!isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" title="Unread" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDateTime(ann.publishDate)}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mt-2 whitespace-pre-wrap">
                  {ann.message}
                </p>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Author: {ann.authorName}</span>
                    <span>• {ann.authorRole}</span>
                  </div>

                  {isLecturer && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
