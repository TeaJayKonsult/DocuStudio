import React, { useState } from 'react';
import { ActivePage, UserProfile } from '../types';
import { FileText, Shield, Sparkles, User, Settings, LogOut, Menu, X, ArrowUpRight } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: UserProfile | null;
  onOpenAuth: (isSignUp?: boolean) => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks: { label: string; page: ActivePage }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Document Tools', page: 'tools' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'Blog', page: 'blog' },
    { label: 'Contact', page: 'contact' },
  ];

  if (currentUser) {
    navLinks.push({ label: 'Dashboard', page: 'dashboard' });
  }

  const handleNavClick = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0C10]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg text-white leading-tight tracking-tight">
              DocuStudio
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">
              by TeaJay Konsult
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activePage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA / User Info */}
        <div className="hidden md:flex items-center gap-3">
          <PWAInstallButton />
          {currentUser ? (
            <div className="flex items-center gap-3">
              {/* Plan badge */}
              <button
                onClick={() => setActivePage('pricing')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentUser.plan === 'pro'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                    : 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25'
                }`}
              >
                {currentUser.plan === 'pro' ? (
                  <>
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>PRO Active</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    <span>{currentUser.actionsRemaining} Free Actions</span>
                  </>
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 font-semibold text-sm hover:border-indigo-400 transition-colors cursor-pointer"
                >
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#16181D] border border-white/10 shadow-2xl py-2 z-50 text-sm">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="font-semibold text-white truncate">{currentUser.displayName || 'DocuStudio User'}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActivePage('dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-indigo-400" />
                      Workspace Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full px-4 py-2 text-left text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </button>
                    <div className="my-1 border-t border-white/5"></div>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth(true)}
                className="px-4.5 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
              >
                <span>Get Started Free</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {currentUser && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300">
              {currentUser.plan === 'pro' ? 'PRO' : `${currentUser.actionsRemaining} left`}
            </span>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0C10] border-b border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNavClick(link.page)}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                activePage === link.page
                  ? 'text-white bg-white/10'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="px-1 py-1">
              <PWAInstallButton />
            </div>
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" /> Settings
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-400 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-lg border border-white/15 text-white"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth(true);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-lg bg-indigo-600 text-white"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
