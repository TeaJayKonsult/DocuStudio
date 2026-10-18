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
  CheckCircle2, 
  Search, 
  Filter,
  FileCheck,
  Shield,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { UserProfile, HistoryItem, ToolType } from '../../types';

interface WpsHomeWorkspaceProps {
  currentUser: UserProfile | null;
  history: HistoryItem[];
  onOpenTool: (tool: ToolType, title?: string) => void;
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
      title: 'PDF Fill & Sign',
      subtitle: 'Forms, checkmarks, signatures',
      icon: <PenTool className="w-5 h-5 text-rose-400" />,
      color: 'hover:border-rose-500/40'
    },
    {
      id: 'pdf-viewer' as ToolType,
      title: 'PDF Viewer',
      subtitle: 'Zoom, multi-page, printing',
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      color: 'hover:border-amber-500/40'
    },
    {
      id: 'text-editor' as ToolType,
      title: 'Document Writer',
      subtitle: 'Rich text, notes, PDF export',
      icon: <FileEdit className="w-5 h-5 text-blue-400" />,
      color: 'hover:border-blue-500/40'
    },
    {
      id: 'document-viewers' as ToolType,
      title: 'Spreadsheets',
      subtitle: 'Excel .xlsx, CSV data grids',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-400" />,
      color: 'hover:border-emerald-500/40'
    },
    {
      id: 'document-viewers' as ToolType,
      title: 'Slide Presentations',
      subtitle: 'PowerPoint .pptx viewer',
      icon: <Presentation className="w-5 h-5 text-amber-500" />,
      color: 'hover:border-amber-500/40'
    },
    {
      id: 'document-viewers' as ToolType,
      title: 'E-Book Reader',
      subtitle: 'EPUB & TXT reading mode',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      color: 'hover:border-purple-500/40'
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
    <div className="flex-1 overflow-y-auto bg-[#12141A] p-6 space-y-6 text-slate-100">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161820] border border-white/5 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-2xl text-white">
            {currentUser ? `Welcome, ${currentUser.displayName}` : 'DocuStudio Workspace'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Native document management, digital signing, and vector PDF compilation.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Open Existing File</span>
          </button>

          <button
            onClick={onLoadSample}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample Agreement Form</span>
          </button>
        </div>
      </div>

      {/* Quick Launch Suite (WPS Office style icon strip) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Quick Create &amp; Tools
          </span>
          <span className="text-[11px] text-slate-500">Click any tool to launch in a tab</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLaunchers.map((tool, idx) => (
            <div
              key={idx}
              onClick={() => onOpenTool(tool.id, tool.title)}
              className={`bg-[#161820] border border-white/5 rounded-xl p-3.5 flex flex-col justify-between hover:bg-white/5 transition-all cursor-pointer group shadow-sm ${tool.color}`}
            >
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
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

      {/* Drag & Drop Quick Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileUpload(e.dataTransfer.files[0]);
          }
        }}
        className="bg-[#161820] border-2 border-dashed border-white/10 hover:border-indigo-500/60 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-indigo-500/5 group"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-sm text-white">
              Drag &amp; drop files here to open in DocuStudio
            </h3>
            <p className="text-xs text-slate-400">
              Supports PDF documents, Word .docx, Excel .xlsx / .csv, PowerPoint .pptx, and EPUB files
            </p>
          </div>
        </div>
      </div>

      {/* Recent Documents Table (WPS Style) */}
      <div className="bg-[#161820] border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Header Filters */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h2 className="font-bold text-sm text-white">Recent Files &amp; Workspace History</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-mono">
              {filteredHistory.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex bg-[#0D0F14] p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('pdf')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  filterType === 'pdf' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                PDFs
              </button>
              <button
                onClick={() => setFilterType('doc')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  filterType === 'doc' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Docs
              </button>
              <button
                onClick={() => setFilterType('sheet')}
                className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                  filterType === 'sheet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sheets
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-8 pr-3 py-1 bg-[#0D0F14] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Files Grid / List */}
        <div className="overflow-x-auto">
          {filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 space-y-2">
              <p>No recent files matching your filter.</p>
              <button
                onClick={onLoadSample}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                Load Sample Agreement Form to begin
              </button>
            </div>
          ) : (
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
                        onOpenTool('pdf-editor-tools', item.documentName);
                      } else if (item.action.toLowerCase().includes('text')) {
                        onOpenTool('text-editor', item.documentName);
                      } else {
                        onOpenTool('document-viewers', item.documentName);
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
                      <button className="px-2.5 py-1 rounded bg-white/5 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors">
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
