import React, { useState } from 'react';
import { X, Lock, Trash2, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { updatePassword } from 'firebase/auth';
import { auth, clearStoredHistory } from '../services/authService';

interface SettingsModalProps {
  isOpen: boolean;
  currentUser: UserProfile;
  onClose: () => void;
  onUpdateUser: (user: UserProfile) => void;
  onDeleteAccount: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdateUser,
  onDeleteAccount
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
      }
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm('Clear all local document activity logs?')) {
      clearStoredHistory(currentUser.uid);
      setMessage({ type: 'success', text: 'Activity history cleared.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#16181D] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold font-serif text-white">Account Settings</h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your credentials and preferences for {currentUser.email}
          </p>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Change password */}
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-indigo-400" />
              Change Password
            </h3>
            <input
              type="password"
              placeholder="New password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0A0C10] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0A0C10] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow cursor-pointer transition-colors"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="border-t border-white/10 pt-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Data & History</h3>
            <button
              type="button"
              onClick={handleClearHistory}
              className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-xl text-xs font-medium text-left cursor-pointer transition-colors"
            >
              Clear Recent Activity History
            </button>
          </div>

          <div className="border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onDeleteAccount}
              className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
