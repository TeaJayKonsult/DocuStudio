import React, { useState, useRef } from 'react';
import { 
  PenTool, 
  FileText, 
  FileEdit, 
  FileSpreadsheet, 
  Presentation, 
  BookOpen, 
  Sparkles, 
  UploadCloud, 
  Clock, 
  Search, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { UserProfile, HistoryItem, ToolType } from '../../types';

interface WpsHomeWorkspaceProps {
  currentUser: UserProfile | null;
  history: HistoryItem[];
  onOpenTool: (tool: ToolType, title?: string, fileType?: 'pdf' | 'doc' | 'sheet' | 'ppt' | 'epub') => void;
  onLoadSample: () => void;
  onFileUpload: (file: File) => void;
}

export const WpsHomeWorkspace: React.FC<WpsHomeWorkspaceProps> = ({
  currentUser,
  history,
  onOpenTool,
  onLoadSample,
  onFileUpload
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const quickLaunchers = [
    {
      id: 'pdf-editor-tools' as ToolType,
      type: 'pdf' as const,
      title: 'PDF Fill & Sign',
      subtitle: 'Forms, checkmarks, signatures',
      icon: <PenTool className="w-5 h-5 text-rose-400" />,
      color: 'hover:border-rose-500/40 bg-gradient-to-br from-rose-500/5 to-transparent'
    },
    {
      id: 'pdf-viewer' as ToolType,
      type: 'pdf' as const,
      title: 'PDF Viewer',
      subtitle: 'Zoom, multi-page, printing',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      color: 'hover:border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent'
    },
    {
      id: 'text-editor' as ToolType,
      type: 'doc' as const,
      title: 'Document Writer',
      subtitle: 'Rich text, notes, PDF export',
      icon: <FileEdit className="w-5 h-5 text-blue-400" />,
      color: 'hover:border-blue-500/40 bg-gradient-to-br from-blue-500/5 to-transparent'
    },
    {
      id: 'document-viewers' as ToolType,
      type: 'sheet' as const,
      title: 'Spreadsheets',
      subtitle: 'Excel .xlsx, CSV data grids',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" />,
      color: 'hover:border-emerald-500/40 bg-gradient-to-br from-emerald-500/5 to-transparent'
    },
    {
      id: 'document-viewers' as ToolType,
      type: 'ppt' as const,
      title: 'Slide Presentations',
      subtitle: 'PowerPoint .pptx viewer',
      icon: <Presentation className="w-5 h-5 text-amber-500" />,
      color: 'hover:border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent'
    },
    {
      id: 'document-viewers' as ToolType,
      type: 'epub' as const,
      title: 'E-Book Reader',
      subtitle: 'EPUB & TXT reading mode',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      color: 'hover:border-purple-500/40 bg-gradient-to-br from-purple-500/5 to-transparent'
    }
  ];

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      item.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterType === 'all') return true;
    if (filterType === 'pdf') return item.action.toLowerCase().includes('pdf');
    if (filterType === 'doc') return item.action.toLowerCase().includes('text') || item.action.toLowerCase().includes('doc');
    if (filterType === 'sheet') return item.action.toLowerCase().includes('sheet') || item.action.toLowerCase().includes('excel');
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#12141A] p-3.5 sm:p-6 pb-28 md:pb-8 space-y-4 sm:space-y-6 text-slate-100">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileUpload(e.target.files[0]);
          }
        }}
        accept=".pdf,.docx,.xlsx,.xls,.csv,.pptx,.ppt,.epub,.txt"
        className="hidden"
      />

      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-[#161820] border border-white/5 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight">
            {currentUser ? `Welcome, ${currentUser.displayName}` : 'DocuStudio Workspace'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Document management, form filling, signatures &amp; multi-format viewers.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-1 sm:pt-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors min-h-[42px]"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Open File</span>
          </button>

          <button
            onClick={onLoadSample}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98 min-h-[42px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sample Agreement</span>
          </button>
        </div>
      </div>

      {/* Quick Launch Suite (WPS Office style icon strip) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Quick Tools
          </span>
          <span className="text-[11px] text-slate-500">Tap to open</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {quickLaunchers.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => onOpenTool(tool.id, tool.title, tool.type)}
              className={`bg-[#161820] border border-white/5 rounded-2xl p-3 sm:p-3.5 flex flex-col justify-between hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer group shadow-sm ${tool.color}`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                {tool.icon}
              </div>
              <div>
                <div className="font-semibold text-xs text-white group-hover:text-indigo-300 transition-colors">
                  {tool.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {tool.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Documents Table & Mobile List (WPS Style) */}
      <div className="bg-[#161820] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        {/* Header with Filter Chips & Search */}
        <div className="p-3.5 sm:p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h2 className="font-bold text-sm text-white">Recent Documents</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
              {filteredHistory.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Chips */}
            <div className="flex bg-[#0D0F14] p-0.5 rounded-xl text-xs overflow-x-auto scrollbar-none">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                  filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('pdf')}
                className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                  filterType === 'pdf' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                PDFs
              </button>
              <button
                onClick={() => setFilterType('doc')}
                className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                  filterType === 'doc' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Docs
              </button>
              <button
                onClick={() => setFilterType('sheet')}
                className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                  filterType === 'sheet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sheets
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-36 sm:w-48 hidden xs:block">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1 bg-[#0D0F14] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredHistory.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-xs text-slate-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-white">No recent documents found</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Open a document or test with our sample contract</p>
            </div>
            <button
              onClick={onLoadSample}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-300 font-semibold cursor-pointer transition-colors inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Agreement Form</span>
            </button>
          </div>
        ) : (
          <>
            {/* 1. Mobile Cards View (< 768px) */}
            <div className="md:hidden divide-y divide-white/5">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.action.toLowerCase().includes('pdf')) {
                      onOpenTool('pdf-editor-tools', item.documentName, 'pdf');
                    } else if (item.action.toLowerCase().includes('text')) {
                      onOpenTool('text-editor', item.documentName, 'doc');
                    } else {
                      onOpenTool('document-viewers', item.documentName, 'sheet');
                    }
                  }}
                  className="p-3.5 flex items-center justify-between active:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                      {item.action.toLowerCase().includes('pdf') ? (
                        <PenTool className="w-4 h-4 text-rose-400" />
                      ) : item.action.toLowerCase().includes('text') ? (
                        <FileEdit className="w-4 h-4 text-blue-400" />
                      ) : (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate max-w-[200px]">
                        {item.documentName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="text-indigo-300">{item.action}</span>
                        <span>•</span>
                        <span>{item.fileSize || 'Standard'}</span>
                        <span>•</span>
                        <span>
                          {new Date(item.timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                </div>
              ))}
            </div>

            {/* 2. Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0D0F14]/70 border-b border-white/5 text-slate-400 font-semibold">
                    <th className="py-2.5 px-4">Document Name</th>
                    <th className="py-2.5 px-4">Operation</th>
                    <th className="py-2.5 px-4">Size</th>
                    <th className="py-2.5 px-4">Last Modified</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => {
                        if (item.action.toLowerCase().includes('pdf')) {
                          onOpenTool('pdf-editor-tools', item.documentName, 'pdf');
                        } else if (item.action.toLowerCase().includes('text')) {
                          onOpenTool('text-editor', item.documentName, 'doc');
                        } else {
                          onOpenTool('document-viewers', item.documentName, 'sheet');
                        }
                      }}
                    >
                      <td className="py-3 px-4 font-medium text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                          {item.action.toLowerCase().includes('pdf') ? (
                            <PenTool className="w-3.5 h-3.5 text-rose-400" />
                          ) : item.action.toLowerCase().includes('text') ? (
                            <FileEdit className="w-3.5 h-3.5 text-blue-400" />
                          ) : (
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <span className="group-hover:text-indigo-300 transition-colors truncate max-w-xs">
                          {item.documentName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-white/5 border border-white/5">
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {item.fileSize || 'Standard'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors">
                          Open
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
