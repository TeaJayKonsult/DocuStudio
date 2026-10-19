import React, { useState } from 'react';
import { 
  Home, 
  PenTool, 
  FileText, 
  FileEdit, 
  FileSpreadsheet, 
  Presentation, 
  BookOpen, 
  Plus, 
  UploadCloud, 
  Sparkles, 
  Settings, 
  HelpCircle, 
  BookMarked, 
  CreditCard,
  ChevronDown,
  Layers,
  FileCheck
} from 'lucide-react';
import { UserProfile, ToolType } from '../../types';

interface WpsSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: UserProfile | null;
  onOpenNewTool: (tool: ToolType, title?: string) => void;
  onTriggerUpgrade: () => void;
  onOpenSettings: () => void;
  onLoadSample: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const WpsSidebar: React.FC<WpsSidebarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenNewTool,
  onTriggerUpgrade,
  onOpenSettings,
  onLoadSample,
  collapsed
}) => {
  const [newDropdownOpen, setNewDropdownOpen] = useState(false);

  const isPro = currentUser?.plan === 'pro';

  const navItems = [
    { id: 'home', label: 'Home / Recents', icon: <Home className="w-4 h-4 text-indigo-400" /> },
    { id: 'pdf-editor-tools', label: 'PDF Fill & Sign', icon: <PenTool className="w-4 h-4 text-rose-400" />, badge: 'Suite' },
    { id: 'pdf-viewer', label: 'PDF Viewer', icon: <FileText className="w-4 h-4 text-amber-400" /> },
    { id: 'text-editor', label: 'Document Writer', icon: <FileEdit className="w-4 h-4 text-blue-400" /> },
    { id: 'document-viewers-sheet', label: 'Spreadsheets', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> },
    { id: 'document-viewers-ppt', label: 'Presentations', icon: <Presentation className="w-4 h-4 text-amber-500" /> },
    { id: 'document-viewers-epub', label: 'E-Book Reader', icon: <BookOpen className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <aside className={`hidden md:flex bg-[#0F1117] border-r border-white/10 flex-col justify-between transition-all duration-200 select-none shrink-0 ${
      collapsed ? 'w-16' : 'w-60'
    }`}>
      {/* Top: + New Button */}
      <div className="p-3 space-y-3">
        <div className="relative">
          <button
            onClick={() => setNewDropdownOpen(!newDropdownOpen)}
            className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer ${
              collapsed ? 'px-2' : ''
            }`}
            title="Create or open document"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {!collapsed && <span>New Document</span>}
            {!collapsed && <ChevronDown className="w-3.5 h-3.5 opacity-80 ml-auto" />}
          </button>

          {/* New Document Popup Menu */}
          {newDropdownOpen && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#16181D] border border-white/10 shadow-2xl py-2 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Create New
              </div>
              <button
                onClick={() => {
                  setNewDropdownOpen(false);
                  onOpenNewTool('pdf-editor-tools', 'New PDF Form');
                }}
                className="w-full px-3 py-2 text-left hover:bg-white/5 flex items-center gap-2.5 text-slate-200 hover:text-white cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-rose-400" />
                <span>PDF Form &amp; Sign</span>
              </button>
              <button
                onClick={() => {
                  setNewDropdownOpen(false);
                  onOpenNewTool('text-editor', 'Untitled Document.doc');
                }}
                className="w-full px-3 py-2 text-left hover:bg-white/5 flex items-center gap-2.5 text-slate-200 hover:text-white cursor-pointer"
              >
                <FileEdit className="w-4 h-4 text-blue-400" />
                <span>Blank Text Document</span>
              </button>
              <button
                onClick={() => {
                  setNewDropdownOpen(false);
                  onOpenNewTool('document-viewers', 'Worksheet.xlsx');
                }}
                className="w-full px-3 py-2 text-left hover:bg-white/5 flex items-center gap-2.5 text-slate-200 hover:text-white cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Spreadsheet / CSV</span>
              </button>

              <div className="my-1 border-t border-white/5"></div>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Actions
              </div>

              <button
                onClick={() => {
                  setNewDropdownOpen(false);
                  onLoadSample();
                }}
                className="w-full px-3 py-2 text-left hover:bg-white/5 flex items-center gap-2.5 text-indigo-300 hover:text-indigo-200 font-semibold cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Load Sample Agreement Form</span>
              </button>
            </div>
          )}
        </div>

        {/* Primary Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setNewDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 font-semibold border-l-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title={item.label}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Plan & Account */}
      <div className="p-3 border-t border-white/10 space-y-2">
        {/* Quota & Pro status box */}
        {!collapsed && (
          <div className="bg-[#16181D] border border-white/5 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Workspace Status</span>
              <span className={`font-bold uppercase ${isPro ? 'text-emerald-400' : 'text-indigo-400'}`}>
                {isPro ? 'Pro Active' : 'Free Tier'}
              </span>
            </div>

            <div className="text-[11px] text-slate-300 flex items-center justify-between">
              <span>Remaining Actions:</span>
              <span className="font-mono font-bold text-white">
                {isPro ? 'Unlimited (∞)' : `${currentUser?.actionsRemaining ?? 5} / 5`}
              </span>
            </div>

            {!isPro && (
              <button
                onClick={onTriggerUpgrade}
                className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3 h-3 text-indigo-200" />
                <span>Upgrade to Pro (₦700)</span>
              </button>
            )}
          </div>
        )}

        {/* Utilities */}
        <div className="space-y-0.5 pt-1">
          <button
            onClick={() => onNavigate('pricing')}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer ${
              currentView === 'pricing' ? 'text-white bg-white/5' : ''
            }`}
            title="Plans & Pricing"
          >
            <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
            {!collapsed && <span>Plans &amp; Pricing</span>}
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
            title="Account Settings"
          >
            <Settings className="w-4 h-4 text-slate-400 shrink-0" />
            {!collapsed && <span>Account Settings</span>}
          </button>

          <button
            onClick={() => onNavigate('contact')}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer ${
              currentView === 'contact' ? 'text-white bg-white/5' : ''
            }`}
            title="Support & Feedback"
          >
            <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
            {!collapsed && <span>Help &amp; Support</span>}
          </button>

          <button
            onClick={() => onNavigate('blog')}
            className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer ${
              currentView === 'blog' ? 'text-white bg-white/5' : ''
            }`}
            title="DocuStudio Guides"
          >
            <BookMarked className="w-4 h-4 text-purple-400 shrink-0" />
            {!collapsed && <span>User Guides</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
