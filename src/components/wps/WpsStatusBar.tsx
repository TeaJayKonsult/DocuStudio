import React from 'react';
import { Shield, Sparkles, CheckCircle, Wifi } from 'lucide-react';
import { UserProfile } from '../../types';

interface WpsStatusBarProps {
  currentUser: UserProfile | null;
  activeDocTitle?: string;
  isOnline?: boolean;
}

export const WpsStatusBar: React.FC<WpsStatusBarProps> = ({
  currentUser,
  activeDocTitle,
  isOnline = true
}) => {
  const isPro = currentUser?.plan === 'pro';

  return (
    <footer className="h-7 bg-[#0D0F14] border-t border-white/10 px-3 flex items-center justify-between text-[11px] text-slate-400 select-none shrink-0 z-20">
      {/* Left: Document & Engine Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium">DocuStudio Engine</span>
        </div>

        {activeDocTitle && (
          <>
            <span className="text-white/20">|</span>
            <span className="text-indigo-300 truncate max-w-xs">{activeDocTitle}</span>
          </>
        )}
      </div>

      {/* Middle: Security Guarantee */}
      <div className="hidden md:flex items-center gap-1.5 text-slate-400">
        <Shield className="w-3 h-3 text-indigo-400" />
        <span>Client-Side Vector Engine • Zero Cloud File Storage</span>
      </div>

      {/* Right: Plan Quota & Online Status */}
      <div className="flex items-center gap-3">
        <span className="font-medium text-slate-300">
          {isPro ? (
            <span className="text-emerald-400 font-bold">PRO UNLIMITED</span>
          ) : (
            <span>Quota: <strong className="text-white">{currentUser?.actionsRemaining ?? 5}/5</strong> Left</span>
          )}
        </span>

        <span className="text-white/20">|</span>

        <div className="flex items-center gap-1">
          <Wifi className="w-3 h-3 text-emerald-400" />
          <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
        </div>
      </div>
    </footer>
  );
};
