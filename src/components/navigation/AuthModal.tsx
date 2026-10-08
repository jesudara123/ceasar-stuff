import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { UserRole } from '../../types';
import { Lock, Mail, User, ShieldCheck, School, Hash } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginUser, registerUser, addToast } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<UserRole>('lecturer');

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [matricNumber, setMatricNumber] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('error', 'Missing Field', 'Please enter your academic email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      if (mode === 'login') {
        loginUser(email, role);
      } else {
        if (!name) {
          addToast('error', 'Missing Name', 'Please provide your full name.');
          setIsLoading(false);
          return;
        }
        registerUser({
          name,
          email,
          role,
          department,
          matricNumber: role === 'student' ? matricNumber : undefined
        });
      }
      setIsLoading(false);
      onClose();
    }, 400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'Academic Portal Sign In' : 'Create Academic Account'}
      description="Access your courses, submissions, and marks"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole('lecturer')}
              className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                role === 'lecturer'
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/10'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <School className={`w-4 h-4 mt-0.5 ${role === 'lecturer' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <div>
                <p className={`text-xs font-bold ${role === 'lecturer' ? 'text-indigo-900' : 'text-slate-800'}`}>Lecturer</p>
                <p className="text-[11px] text-slate-500">Manage courses & grade</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                role === 'student'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/10'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 mt-0.5 ${role === 'student' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <div>
                <p className={`text-xs font-bold ${role === 'student' ? 'text-emerald-900' : 'text-slate-800'}`}>Student</p>
                <p className="text-[11px] text-slate-500">Submit work & see marks</p>
              </div>
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={role === 'lecturer' ? 'Prof. Jane Doe' : 'Jane Doe'}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === 'lecturer' ? 'dr.cusson@faculty.edu' : 'a.rivera@student.edu'}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {mode === 'signup' && role === 'student' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Matriculation Number</label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={matricNumber}
                onChange={e => setMatricNumber(e.target.value)}
                placeholder="CSC/2023/0481"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              placeholder="Computer Science & Engineering"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => addToast('info', 'Password Reset', 'A password reset link has been dispatched to your university email.')}
                className="text-xs text-indigo-600 hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {mode === 'login' && (
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              Remember me on this workstation
            </label>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full py-2.5 mt-2"
          isLoading={isLoading}
        >
          {mode === 'login' ? `Sign In as ${role === 'lecturer' ? 'Lecturer' : 'Student'}` : 'Complete Registration'}
        </Button>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Log in
              </button>
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
};
