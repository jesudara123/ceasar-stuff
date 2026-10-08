import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Search,
  Bell,
  ArrowRightLeft,
  ChevronDown,
  UserCheck,
  GraduationCap,
  Sparkles,
  CheckCheck,
  CalendarDays,
  FileText,
  LogOut,
  RotateCcw
} from 'lucide-react';
import { formatRelativeDeadline } from '../../utils/formatters';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, onOpenAuthModal }) => {
  const {
    currentUser,
    users,
    switchUser,
    setIsSearchOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
    setCurrentTab,
    setSelectedSubmissionId,
    setSelectedAssignmentId,
    resetDemoData
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif: any) => {
    markNotificationRead(notif.id);
    setIsNotifOpen(false);
    if (notif.linkTab) {
      setCurrentTab(notif.linkTab);
      if (notif.linkTab === 'submissions' && notif.linkId) {
        setSelectedSubmissionId(notif.linkId);
      }
      if (notif.linkTab === 'assignment_detail' && notif.linkId) {
        setSelectedAssignmentId(notif.linkId);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile hamburger & Global Search bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full max-w-md flex items-center justify-between px-3.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 hover:border-slate-300 text-slate-400 text-sm transition-all text-left shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="truncate">Search students, assignments, courses...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-medium bg-white text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher Pill */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserSwitcherOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-900 text-xs font-medium transition-all shadow-2xs"
            title="Switch demo user role"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-semibold text-indigo-700 capitalize">
              {currentUser.role} ({currentUser.name.split(' ')[0]})
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />
          </button>

          {/* User Switcher Dropdown */}
          {isUserSwitcherOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Switch Demo Perspective</p>
                <p className="text-[11px] text-slate-500">Test workflows as lecturer or student</p>
              </div>

              <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Lecturer Account
                </div>
                {users.filter(u => u.role === 'lecturer').map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsUserSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.department}</p>
                    </div>
                    {u.id === currentUser.id && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                  </button>
                ))}

                <div className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Student Accounts ({users.filter(u => u.role === 'student').length})</span>
                </div>
                {users.filter(u => u.role === 'student').map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsUserSwitcherOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      u.id === currentUser.id
                        ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{u.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{u.matricNumber || u.email}</p>
                    </div>
                    {u.id === currentUser.id && <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>

              <div className="pt-2 mt-1 border-t border-slate-100 px-2 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setIsUserSwitcherOpen(false);
                    onOpenAuthModal();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg flex items-center gap-2"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Sign In / Create Account
                </button>
                <button
                  onClick={() => {
                    setIsUserSwitcherOpen(false);
                    resetDemoData();
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Sample Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(prev => !prev)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
                  <p className="text-xs text-slate-500">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center px-4">
                    <p className="text-sm font-medium text-slate-700">You're all caught up.</p>
                    <p className="text-xs text-slate-400 mt-1">No pending notifications at this time.</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                        !n.read ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-indigo-600' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current User Avatar thumbnail */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
              {currentUser.role === 'lecturer' ? 'Lecturer' : currentUser.matricNumber}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
