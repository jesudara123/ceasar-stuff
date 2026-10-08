import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  BookOpen,
  MapPin,
  Trash2,
  ExternalLink
} from 'lucide-react';

export const AcademicCalendar: React.FC = () => {
  const {
    currentUser,
    calendarEvents,
    addCalendarEvent,
    deleteCalendarEvent,
    courses,
    assignments,
    setCurrentTab,
    setSelectedAssignmentId
  } = useApp();

  const isLecturer = currentUser.role === 'lecturer';

  // Current viewed month: Oct 2026 (matching our demo timeframe)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 is October

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026-10-14');
  const [eventTime, setEventTime] = useState('10:00');
  const [eventType, setEventType] = useState<'lecture' | 'exam' | 'office_hours' | 'other'>('office_hours');
  const [eventCourseId, setEventCourseId] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Create grid cells
  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ dayNumber: null, dateString: '' });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    const dateString = `${currentYear}-${mm}-${dd}`;
    calendarDays.push({ dayNumber: d, dateString });
  }

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;

    const course = courses.find(c => c.id === eventCourseId);
    addCalendarEvent({
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      courseId: eventCourseId || undefined,
      courseCode: course?.code,
      type: eventType,
      description: eventDescription
    });

    setIsAddEventModalOpen(false);
    setEventTitle('');
    setEventDescription('');
  };

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'assignment_deadline':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'exam':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'lecture':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'office_hours':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Academic Calendar</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Schedules for assignment due dates, lecture hours, and university assessments.
          </p>
        </div>

        {isLecturer && (
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddEventModalOpen(true)}
          >
            Create Event
          </Button>
        )}
      </div>

      {/* Calendar Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(9);
            }}
          >
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-600 uppercase py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[550px]">
          {calendarDays.map((cell, idx) => {
            if (!cell.dayNumber) {
              return <div key={`empty_${idx}`} className="bg-slate-50/40 min-h-[90px] p-2" />;
            }

            const dayEvents = calendarEvents.filter(e => e.date === cell.dateString);
            const isToday = cell.dateString === '2026-10-08';

            return (
              <div
                key={cell.dateString}
                className={`min-h-[90px] p-2 flex flex-col transition-colors ${
                  isToday ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday ? 'bg-indigo-600 text-white font-bold' : 'text-slate-700'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Event Pills */}
                <div className="space-y-1 flex-1 overflow-y-auto">
                  {dayEvents.map(ev => {
                    const badgeClass = getEventBadgeColor(ev.type);
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        className={`text-[10px] p-1.5 rounded border leading-tight truncate cursor-pointer transition-transform hover:scale-[1.02] ${badgeClass}`}
                        title={ev.title}
                      >
                        <span className="font-bold block truncate">{ev.title}</span>
                        {ev.time && <span className="opacity-80 block truncate">{ev.time}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title || 'Event Details'}
        description={`Date: ${selectedEvent?.date} ${selectedEvent?.time ? `at ${selectedEvent.time}` : ''}`}
        maxWidth="md"
        footer={
          <div className="flex items-center justify-between w-full">
            {isLecturer && selectedEvent?.type !== 'assignment_deadline' ? (
              <Button
                variant="danger"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => {
                  if (selectedEvent) {
                    deleteCalendarEvent(selectedEvent.id);
                    setSelectedEvent(null);
                  }
                }}
              >
                Delete Event
              </Button>
            ) : <div />}

            <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
              Close
            </Button>
          </div>
        }
      >
        {selectedEvent && (
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500 uppercase tracking-wider">Type:</span>
              <Badge variant="primary" size="sm">
                {selectedEvent.type.replace('_', ' ').toUpperCase()}
              </Badge>
              {selectedEvent.courseCode && (
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold">
                  {selectedEvent.courseCode}
                </span>
              )}
            </div>

            {selectedEvent.description && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Details:</span>
                <p className="text-slate-600 leading-relaxed">{selectedEvent.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Event Modal */}
      <Modal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        title="Schedule Academic Event"
        description="Add a deadline, guest lecture, or office consultation"
        maxWidth="md"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={eventTitle}
              onChange={e => setEventTitle(e.target.value)}
              placeholder="e.g. CSC 305 Guest Lecture on Cloud DBs"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="text"
                value={eventTime}
                onChange={e => setEventTime(e.target.value)}
                placeholder="14:00 - 15:30"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Event Category
              </label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="office_hours">Office Hours</option>
                <option value="lecture">Lecture / Seminar</option>
                <option value="exam">Assessment / Exam</option>
                <option value="other">General University Event</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Related Course (Optional)
              </label>
              <select
                value={eventCourseId}
                onChange={e => setEventCourseId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="">None (Faculty-Wide)</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.code}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description & Location
            </label>
            <textarea
              rows={2}
              value={eventDescription}
              onChange={e => setEventDescription(e.target.value)}
              placeholder="e.g. Turing Hall Room 402 or online link..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddEventModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
