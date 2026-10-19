import React from 'react';
import { Folder, Wrench, Plus, FileSpreadsheet, User, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';

interface WpsMobileBottomBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onNewAction: () => void;
  currentUser: UserProfile | null;
}

export const WpsMobileBottomBar: React.FC<WpsMobileBottomBarProps> = ({
  currentView,
  onNavigate,
  onNewAction,
  currentUser
}) => {
  return (
    <nav className="md:hidden bg-[#0D0F14]/98 backdrop-blur-xl border-t border-white/10 px-2 grid grid-cols-5 items-center shrink-0 z-40 select-none pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {/* 1. Files / Recent */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] cursor-pointer ${
          currentView === 'home' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Folder className="w-5 h-5 mb-1" />
        <span className="text-[10px] tracking-tight">Files</span>
      </button>

      {/* 2. PDF Tools */}
      <button
        onClick={() => onNavigate('pdf-editor-tools')}
        className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] cursor-pointer ${
          currentView === 'pdf-editor-tools' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Wrench className="w-5 h-5 mb-1" />
        <span className="text-[10px] tracking-tight">PDF Tools</span>
      </button>

      {/* 3. Center Floating Action Button (WPS / Android Style) */}
      <div className="flex items-center justify-center">
        <button
          onClick={onNewAction}
          className="w-13 h-13 -mt-6 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-indigo-400 text-white shadow-xl shadow-indigo-600/50 flex items-center justify-center active:scale-95 transition-transform cursor-pointer border-3 border-[#0D0F14]"
          title="Create or Open Document"
          aria-label="Create or Open Document"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* 4. Sheets & Viewers */}
      <button
        onClick={() => onNavigate('document-viewers')}
        className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] cursor-pointer ${
          currentView === 'document-viewers' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <FileSpreadsheet className="w-5 h-5 mb-1" />
        <span className="text-[10px] tracking-tight">Sheets</span>
      </button>

      {/* 5. Account / Pro */}
      <button
        onClick={() => onNavigate('pricing')}
        className={`flex flex-col items-center justify-center py-1 transition-colors min-h-[48px] cursor-pointer ${
          currentView === 'pricing' ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-white'
        }`}
      >
        {currentUser?.plan === 'pro' ? (
          <Sparkles className="w-5 h-5 mb-1 text-emerald-400" />
        ) : (
          <User className="w-5 h-5 mb-1" />
        )}
        <span className="text-[10px] tracking-tight">
          {currentUser?.plan === 'pro' ? 'PRO' : 'Account'}
        </span>
      </button>
    </nav>
  );
};
