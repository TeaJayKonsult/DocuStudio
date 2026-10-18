import React from 'react';
import { Home, X, Plus, FileText, PenTool, FileSpreadsheet, Presentation, BookOpen, FileEdit } from 'lucide-react';
import { ToolType } from '../../types';

export interface OpenDocTab {
  id: string;
  title: string;
  toolType: ToolType;
  fileType: 'pdf' | 'doc' | 'sheet' | 'ppt' | 'epub';
  fileData?: any;
}

interface WpsTabBarProps {
  activeTabId: string;
  openTabs: OpenDocTab[];
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
}

export const WpsTabBar: React.FC<WpsTabBarProps> = ({
  activeTabId,
  openTabs,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) => {
  const getTabIcon = (tab: OpenDocTab) => {
    switch (tab.fileType) {
      case 'pdf':
        return <PenTool className="w-3.5 h-3.5 text-rose-400" />;
      case 'doc':
        return <FileEdit className="w-3.5 h-3.5 text-blue-400" />;
      case 'sheet':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />;
      case 'ppt':
        return <Presentation className="w-3.5 h-3.5 text-amber-400" />;
      case 'epub':
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="flex items-center bg-[#0D0F14] border-b border-white/10 px-2 pt-1.5 overflow-x-auto select-none scrollbar-none h-11 shrink-0">
      {/* Home Tab */}
      <button
        onClick={() => onSelectTab('home')}
        className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-t-lg transition-all cursor-pointer border-t-2 ${
          activeTabId === 'home'
            ? 'bg-[#16181D] text-white border-indigo-500 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent'
        }`}
      >
        <Home className="w-3.5 h-3.5 text-indigo-400" />
        <span>Workspace Home</span>
      </button>

      {/* Dynamic Open Document Tabs */}
      {openTabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`group relative flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-all cursor-pointer border-t-2 max-w-[200px] ${
              isActive
                ? 'bg-[#16181D] text-white border-indigo-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-transparent'
            }`}
          >
            {getTabIcon(tab)}
            <span className="truncate max-w-[120px]">{tab.title}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Close Tab"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}

      {/* Plus New Tab */}
      <button
        onClick={onNewTab}
        className="p-1.5 ml-1 rounded-md text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        title="Open or Create Document"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};
