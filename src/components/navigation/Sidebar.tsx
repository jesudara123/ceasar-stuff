import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  Inbox,
  Users,
  GraduationCap,
  Megaphone,
  Calendar,
  BarChart3,
  Settings,
  ChevronRight,
  BookMarked,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const {
    currentUser,
    currentTab,
    setCurrentTab,
    setSelectedCourseId,
    setSelectedAssignmentId,
    submissions,
    assignments
  } = useApp();

  const isLecturer = currentUser.role === 'lecturer';

  // Submissions to grade for lecturer
  const toGradeCount = submissions.filter(s => s.status === 'submitted' || s.status === 'late').length;

  // Active assignments pending for student
  const studentPendingCount = assignments.filter(a => {
    if (a.status !== 'published') return false;
    const hasSub = submissions.some(s => s.assignmentId === a.id && s.studentId === currentUser.id);
    return !hasSub;
  }).length;

  const lecturerNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileCheck2 },
    { id: 'submissions', label: 'Submissions', icon: Inbox, badge: toGradeCount > 0 ? toGradeCount : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'grades', label: 'Grades & Marks', icon: GraduationCap },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const studentNavItems = [
    { id: 'dashboard', label: 'Student Home', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'assignments', label: 'My Assignments', icon: FileCheck2, badge: studentPendingCount > 0 ? studentPendingCount : undefined, badgeColor: 'bg-indigo-100 text-indigo-800' },
    { id: 'grades', label: 'Grades & Feedback', icon: GraduationCap },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
  ];

  const navItems = isLecturer ? lecturerNavItems : studentNavItems;

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setSelectedCourseId(null);
    setSelectedAssignmentId(null);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col z-40 transition-transform duration-200 ease-in-out shrink-0 border-r border-slate-800 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-base block leading-tight">
              Lecturer<span className="text-indigo-400">Hub</span>
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Assignment Manager
            </span>
          </div>
        </div>

        {/* Role Indicator Banner */}
        <div className="px-4 py-3 mx-3 my-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLecturer ? 'bg-indigo-400' : 'bg-emerald-400'} animate-pulse`} />
            <span className="text-xs font-medium text-slate-200">
              {isLecturer ? 'Faculty Portal' : 'Student Portal'}
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-700/80 text-slate-300 font-semibold tracking-wide uppercase">
            {currentUser.role}
          </span>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-indigo-700' : item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card at Bottom */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40 border border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {isLecturer ? (currentUser.title || 'Lecturer') : (currentUser.matricNumber || 'Student')}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
