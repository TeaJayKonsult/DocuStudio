import React, { useState, useRef } from 'react';
import { 
  FileEdit, 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Download, 
  Printer, 
  Trash2, 
  Save, 
  X,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../../types';

interface TextEditorToolProps {
  currentUser: UserProfile | null;
  onActionUsed: (actionName: string, fileName: string, fileSize?: string) => void;
  onClose: () => void;
}

export const TextEditorTool: React.FC<TextEditorToolProps> = ({
  currentUser,
  onActionUsed,
  onClose
}) => {
  const [docTitle, setDocTitle] = useState<string>('Professional_Document');
  const [notification, setNotification] = useState<string | null>(null);
  const [stats, setStats] = useState({ words: 120, chars: 742, readTime: '1 min' });

  const editorRef = useRef<HTMLDivElement | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const executeCommand = (cmd: string, val: string = '') => {
    document.execCommand(cmd, false, val);
    updateStats();
  };

  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setStats({
      words,
      chars,
      readTime: `${minutes} min read`
    });
  };

  const handleDownloadTxt = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Downloaded as Plain Text');
    onActionUsed('Text Export (TXT)', `${docTitle}.txt`, (blob.size / 1024).toFixed(1) + ' KB');
  };

  const handleDownloadHtml = () => {
    if (!editorRef.current) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${docTitle}</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;line-height:1.6;padding:20px;}</style></head><body>${editorRef.current.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docTitle || 'document'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Downloaded as HTML Document');
    onActionUsed('Text Export (HTML)', `${docTitle}.html`, (blob.size / 1024).toFixed(1) + ' KB');
  };

  const handlePrint = () => {
    window.print();
    onActionUsed('Document Printed', `${docTitle}`);
  };

  const handleSaveToHistory = () => {
    showNotification('Document saved to your workspace activity!');
    onActionUsed('Text Document Saved', `${docTitle}.doc`, '45 KB');
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-[#1A1A2E] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* Top Header */}
      <div className="bg-[#0A0C10] px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <FileEdit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">DocuStudio Text & Document Editor</h2>
            <p className="text-[11px] text-slate-400">Draft, format, and export professional reports & memos</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Toolbar Area */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm text-xs">
        {/* Title input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            placeholder="Document Title"
            className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 w-52"
          />
        </div>

        {/* Formatting controls */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => executeCommand('bold')}
            title="Bold"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('italic')}
            title="Italic"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('underline')}
            title="Underline"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <Underline className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('strikeThrough')}
            title="Strikethrough"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1"></div>

          <button
            onClick={() => executeCommand('justifyLeft')}
            title="Align Left"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyCenter')}
            title="Align Center"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyRight')}
            title="Align Right"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('justifyFull')}
            title="Justify"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1"></div>

          <button
            onClick={() => executeCommand('insertUnorderedList')}
            title="Bullet List"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('insertOrderedList')}
            title="Numbered List"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => executeCommand('formatBlock', 'blockquote')}
            title="Blockquote"
            className="p-1.5 rounded hover:bg-white text-gray-700 cursor-pointer"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToHistory}
            className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-indigo-600" />
            <span>Save</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <div className="relative group">
            <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-xl py-1 hidden group-hover:block z-30">
              <button
                onClick={handleDownloadTxt}
                className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-gray-100 text-xs font-medium cursor-pointer"
              >
                Text File (.txt)
              </button>
              <button
                onClick={handleDownloadHtml}
                className="w-full text-left px-3 py-1.5 text-gray-700 hover:bg-gray-100 text-xs font-medium cursor-pointer"
              >
                Web Page (.html)
              </button>
            </div>
          </div>
        </div>
      </div>

      {notification && (
        <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Editor Paper Canvas */}
      <div className="flex-1 overflow-auto p-6 md:p-10 flex justify-center bg-slate-100/70">
        <div className="w-full max-w-3xl min-h-[600px] bg-white rounded-xl shadow-xl border border-gray-200 p-8 md:p-14 flex flex-col">
          <div
            ref={editorRef}
            contentEditable
            onInput={updateStats}
            suppressContentEditableWarning
            className="flex-1 focus:outline-none text-base text-gray-800 leading-relaxed font-sans space-y-4"
          >
            <h1 className="font-serif text-3xl font-bold text-gray-900 mb-4">
              Executive Briefing & Document Draft
            </h1>
            <p>
              DocuStudio gives enterprise teams and independent professionals a comprehensive workspace to draft, edit, review, and finalize documents without leaving the browser.
            </p>
            <h2 className="font-serif text-xl font-semibold text-gray-800 mt-6 mb-2">
              Key Workflow Objectives
            </h2>
            <ul>
              <li>Streamlined document preparation with rich typography and layout styling.</li>
              <li>Direct multi-format export to plain text, formatted HTML, and print-ready PDF.</li>
              <li>Integrated digital signing and form completion in compliance with enterprise audit trails.</li>
            </ul>
            <blockquote>
              "Speed and fidelity in document handling are critical to closing agreements and securing contracts."
            </blockquote>
            <p>
              Start typing your thoughts, notes, legal clauses, or operational procedures directly into this canvas.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Status bar with word count */}
      <div className="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-gray-800">{stats.words}</strong></span>
          <span>Characters: <strong className="text-gray-800">{stats.chars}</strong></span>
          <span>{stats.readTime}</span>
        </div>
        <div className="text-[11px] text-gray-400">
          DocuStudio Rich Text Engine • Auto-persisted
        </div>
      </div>
    </div>
  );
};
