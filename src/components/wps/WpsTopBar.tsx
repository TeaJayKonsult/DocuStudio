import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  Shield, 
  CreditCard,
  HelpCircle,
  BookMarked
} from 'lucide-react';
import { UserProfile } from '../../types';
import { PWAInstallButton } from '../PWAInstallButton';

interface WpsTopBarProps {
  currentUser: UserProfile | null;
  onOpenAuth: (isSignUp?: boolean) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onTriggerUpgrade: () => void;
  onNavigate: (view: string) => void;
  onToggleSidebar: () => void;
}

export const WpsTopBar: React.FC<WpsTopBarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSettings,
  onTriggerUpgrade,
  onNavigate,
  onToggleSidebar
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isPro = currentUser?.plan === 'pro';

  return (
    <header className="h-14 sm:h-13 bg-[#0A0C10] border-b border-white/10 px-3.5 sm:px-4 flex items-center justify-between select-none shrink-0 z-30 pt-[max(env(safe-area-inset-top),0px)]">
      {/* Left: Hamburger (Desktop) & Brand Logo */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-serif font-bold text-base text-white tracking-tight">DocuStudio</span>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                PRO
              </span>
            </div>
            <span className="text-[8px] uppercase tracking-wider text-slate-400 font-medium">by TeaJay Konsult</span>
          </div>
        </div>
      </div>

      {/* Middle: Universal Search Bar (Desktop) */}
      <div className="hidden md:flex items-center max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search documents, tools, and actions..."
            className="w-full pl-9 pr-4 py-1.5 bg-[#161820] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        <PWAInstallButton />

        {/* Upgrade / Plan Badge */}
        {!isPro ? (
          <button
            onClick={onTriggerUpgrade}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-sm shadow-indigo-600/20 cursor-pointer transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span className="hidden xs:inline">Upgrade</span>
            <span className="xs:hidden">₦700</span>
            <span className="hidden sm:inline">₦700/mo</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            <span className="hidden xs:inline">Pro</span>
            <span className="hidden sm:inline">Active</span>
          </div>
        )}

        {/* User Account / Sign In */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-semibold text-xs hover:border-indigo-400 transition-colors cursor-pointer"
            >
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#16181D] border border-white/10 shadow-2xl py-2 z-50 text-xs animate-in fade-in-50 duration-150">
                <div className="px-3.5 py-2 border-b border-white/5">
                  <p className="font-semibold text-white truncate">{currentUser.displayName || 'DocuStudio User'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                </div>

                <div className="px-3.5 py-2 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-400 text-[11px]">Monthly Quota</span>
                    <span className="font-bold text-white text-[11px]">
                      {isPro ? 'Unlimited' : `${currentUser.actionsRemaining} left`}
                    </span>
                  </div>
                  {!isPro && (
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (currentUser.actionsRemaining / 5) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Account &amp; Security</span>
                </button>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onTriggerUpgrade();
                  }}
                  className="w-full px-3.5 py-2 text-left text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Subscription Plans</span>
                </button>

                <div className="border-t border-white/5 my-1" />

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full px-3.5 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
