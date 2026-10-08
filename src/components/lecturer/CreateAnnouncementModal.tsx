import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Megaphone, AlertTriangle } from 'lucide-react';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({ isOpen, onClose }) => {
  const { addAnnouncement, courses, addToast } = useApp();

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('all');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      addToast('error', 'Missing Information', 'Please provide a title and announcement message.');
      return;
    }

    addAnnouncement({
      title: title.trim(),
      message: message.trim(),
      courseId,
      isUrgent
    });

    onClose();
    setTitle('');
    setMessage('');
    setIsUrgent(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Post Academic Announcement"
      description="Send a message to enrolled students across courses"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Announcement Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Schedule for Mid-Term Assessment"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Target Audience
          </label>
          <select
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
          >
            <option value="all">All Courses & All Students</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Announcement Body <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Write clear instructions, deadlines, or consultation room updates..."
            className="w-full p-3 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={e => setIsUrgent(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span className="flex items-center gap-1 text-rose-700 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Flag as Urgent Announcement
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            Broadcast Notice
          </Button>
        </div>
      </form>
    </Modal>
  );
};
