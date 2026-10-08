import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import {
  Settings,
  User,
  Shield,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Bell,
  Mail,
  School,
  FileText
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, resetDemoData, addToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [title, setTitle] = useState(currentUser.title || 'Senior Associate Professor');
  const [office, setOffice] = useState(currentUser.office || 'Turing Hall, Room 402');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.name = name;
    currentUser.email = email;
    currentUser.title = title;
    currentUser.office = office;
    addToast('success', 'Profile Saved', 'Your faculty profile settings have been updated.');
  };

  const handleExportData = () => {
    try {
      const exportObject = {
        users: localStorage.getItem('lam_users_v1'),
        courses: localStorage.getItem('lam_courses_v1'),
        assignments: localStorage.getItem('lam_assignments_v1'),
        submissions: localStorage.getItem('lam_submissions_v1'),
        announcements: localStorage.getItem('lam_announcements_v1'),
        notifications: localStorage.getItem('lam_notifications_v1'),
        calendar: localStorage.getItem('lam_calendar_v1'),
        exportedAt: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lecturer_assignment_manager_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('success', 'Data Exported', 'Downloaded complete database backup.');
    } catch (err) {
      addToast('error', 'Export Failed', 'Unable to generate JSON backup.');
    }
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-150 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Configure academic preferences, faculty credentials, and data persistence.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-600" /> Faculty Profile Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Academic Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Academic Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Office / Consultation Location
            </label>
            <input
              type="text"
              value={office}
              onChange={e => setOffice(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="primary" size="sm">
            Save Profile Changes
          </Button>
        </div>
      </form>

      {/* Persistence & Data Backup */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-600" /> Database & Storage Management
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          The system maintains persistent records of courses, submissions, rubrics, and grades. You can export a snapshot backup or reset to default demo data.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportData}
          >
            Export Database Backup (JSON)
          </Button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={() => setIsResetModalOpen(true)}
          >
            Reset to Sample Demo Data
          </Button>
        </div>
      </div>

      {/* Confirmation Modal for Resetting Data */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset Entire Application to Demo Data?"
        description="All newly created courses, submissions, and grades will be reverted to sample state."
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                resetDemoData();
                setIsResetModalOpen(false);
              }}
            >
              Confirm Reset
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          This operation will clear all modifications made in local storage and restore the pristine initial courses (CSC 301, CSC 305, CSC 309, CSC 315) and student submissions.
        </p>
      </Modal>
    </div>
  );
};
