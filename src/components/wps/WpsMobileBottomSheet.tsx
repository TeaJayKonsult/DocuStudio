import React, { useRef } from 'react';
import { 
  X, 
  PenTool, 
  FileText, 
  FileEdit, 
  FileSpreadsheet, 
  Presentation, 
  UploadCloud, 
  Sparkles,
  FileCheck
} from 'lucide-react';
import { ToolType } from '../../types';

interface WpsMobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (tool: ToolType, title?: string, fileType?: 'pdf' | 'doc' | 'sheet' | 'ppt' | 'epub') => void;
  onUploadFile: (file: File) => void;
  onLoadSample: () => void;
}

export const WpsMobileBottomSheet: React.FC<WpsMobileBottomSheetProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onUploadFile,
  onLoadSample
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Up Bottom Sheet Panel */}
      <div className="relative z-10 w-full bg-[#161820] border-t border-white/10 rounded-t-3xl p-5 pb-safe max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Drag Handle indicator */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Create &amp; Open</h2>
            <p className="text-xs text-slate-400">Choose a tool or document format</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onUploadFile(e.target.files[0]);
              onClose();
            }
          }}
          accept=".pdf,.docx,.xlsx,.xls,.csv,.pptx,.ppt,.epub,.txt"
          className="hidden"
        />

        {/* Grid of Mobile Actions */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* 1. PDF Fill & Sign */}
          <button
            onClick={() => {
              onSelectAction('pdf-editor-tools', 'PDF Form & Sign', 'pdf');
              onClose();
            }}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 active:scale-[0.98] transition-transform text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Fill &amp; Sign PDF</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">Contracts, forms &amp; digital signatures</div>
            </div>
          </button>

          {/* 2. PDF Viewer */}
          <button
            onClick={() => {
              onSelectAction('pdf-viewer', 'PDF Viewer', 'pdf');
              onClose();
            }}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 active:scale-[0.98] transition-transform text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">PDF Reader</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">Read, zoom, print &amp; multi-page view</div>
            </div>
          </button>

          {/* 3. Word Document Writer */}
          <button
            onClick={() => {
              onSelectAction('text-editor', 'New Document.doc', 'doc');
              onClose();
            }}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 active:scale-[0.98] transition-transform text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Word Document</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">Rich text drafting &amp; PDF export</div>
            </div>
          </button>

          {/* 4. Spreadsheet View */}
          <button
            onClick={() => {
              onSelectAction('document-viewers', 'Spreadsheet.xlsx', 'sheet');
              onClose();
            }}
            className="flex items-start gap-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 active:scale-[0.98] transition-transform text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Spreadsheets</div>
              <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">Excel (.xlsx, .csv) workbook grid</div>
            </div>
          </button>
        </div>

        {/* Bottom Quick Triggers */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[46px]"
          >
            <UploadCloud className="w-4 h-4 text-indigo-400" />
            <span>Open Existing File from Device</span>
          </button>

          <button
            onClick={() => {
              onLoadSample();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[44px]"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Load Sample Agreement Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};
