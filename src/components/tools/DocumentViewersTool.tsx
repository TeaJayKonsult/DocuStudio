import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Presentation, 
  BookOpen, 
  FileText, 
  UploadCloud, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Eye,
  Sliders
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { UserProfile } from '../../types';

interface DocumentViewersToolProps {
  currentUser: UserProfile | null;
  onActionUsed: (actionName: string, fileName: string, fileSize?: string) => void;
  onClose: () => void;
}

export const DocumentViewersTool: React.FC<DocumentViewersToolProps> = ({
  currentUser,
  onActionUsed,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'ppt' | 'epub' | 'docx'>('excel');

  // Excel state
  const [excelSheets, setExcelSheets] = useState<string[]>(['Q4 Financials', 'Headcount', 'CapEx']);
  const [activeSheet, setActiveSheet] = useState<string>('Q4 Financials');
  const [excelData, setExcelData] = useState<any[][]>([
    ['Metric', 'Target', 'Actual', 'Variance', 'Status'],
    ['Gross Revenue', '₦14,500,000', '₦16,200,000', '+11.7%', 'Exceeded'],
    ['Operating Expenses', '₦5,200,000', '₦4,850,000', '-6.7%', 'Optimal'],
    ['Net Profit', '₦9,300,000', '₦11,350,000', '+22.0%', 'Record'],
    ['Client Retention', '92%', '96.4%', '+4.4%', 'Excellent'],
    ['Active Subscriptions', '1,200', '1,480', '+23.3%', 'Growing']
  ]);
  const [excelSearch, setExcelSearch] = useState<string>('');

  // PPT state
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const slides = [
    {
      title: 'DocuStudio Product Roadmap 2026',
      subtitle: 'TeaJay Konsult Strategic Overview',
      points: [
        'Enterprise document lifecycle management',
        'Direct browser-level cryptographic form signing',
        'Zero-trust encryption for client confidential files'
      ],
      notes: 'Key talking point: emphasizes high security and no document storage on 3rd party servers.'
    },
    {
      title: 'Market Opportunity & Pro Adoption',
      subtitle: 'Targeting Legal, Accounting & Consulting Sectors',
      points: [
        'Flexible ₦700/mo flat-rate for unlimited operations',
        'Paystack automated billing with instant activation',
        'Cross-platform desktop & mobile PWA compatibility'
      ],
      notes: 'Highlight the affordability compared to expensive international legacy PDF tools.'
    },
    {
      title: 'Technology & Architecture',
      subtitle: 'Next-Generation Web Standards',
      points: [
        'Vite + React SPA with WebAssembly PDF compilation',
        'Local client-side execution for zero latency',
        'Offline capability for on-site client meetings'
      ],
      notes: 'Answer technical audit questions regarding GDPR and local data protection.'
    }
  ];

  // EPUB / E-Book state
  const [ebookTheme, setEbookTheme] = useState<'light' | 'sepia' | 'dark'>('sepia');
  const [ebookFontSize, setEbookFontSize] = useState<number>(16);

  // DOCX state
  const [docxContent, setDocxContent] = useState<string>(
    '# MASTER SERVICES AGREEMENT\n\nThis Master Services Agreement is entered into by and between the Client and TeaJay Konsult.\n\n### 1. Scope of Work\nThe Contractor agrees to deliver digital document workflows, security consulting, and workspace management tools under the terms set forth herein.\n\n### 2. Confidentiality & Privacy\nAll proprietary documents processed through the client interface remain strictly confidential. No unauthorized copies shall be retained on remote shared servers without express permission.\n\n### 3. Payment & Subscription Terms\nServices rendered under Pro membership will be billed according to the agreed schedule via automated settlement gateway.'
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      setActiveTab('excel');
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        setExcelSheets(wb.SheetNames);
        const wsname = wb.SheetNames[0];
        setActiveSheet(wsname);
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        setExcelData(data);
        onActionUsed('Spreadsheet Loaded', file.name, (file.size / 1024).toFixed(1) + ' KB');
      };
      reader.readAsBinaryString(file);
    } else if (ext === 'pptx' || ext === 'ppt') {
      setActiveTab('ppt');
      onActionUsed('Presentation Loaded', file.name, (file.size / 1024).toFixed(1) + ' KB');
    } else if (ext === 'epub' || ext === 'txt') {
      setActiveTab('epub');
      const reader = new FileReader();
      reader.onload = (evt) => {
        onActionUsed('E-Book Opened', file.name, (file.size / 1024).toFixed(1) + ' KB');
      };
      reader.readAsText(file);
    } else if (ext === 'docx' || ext === 'doc') {
      setActiveTab('docx');
      onActionUsed('DOCX Document Opened', file.name, (file.size / 1024).toFixed(1) + ' KB');
    }
  };

  const filteredExcelRows = excelData.filter((row, i) => {
    if (i === 0) return true; // keep header
    if (!excelSearch.trim()) return true;
    return row.some((cell) => String(cell || '').toLowerCase().includes(excelSearch.toLowerCase()));
  });

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-[#1A1A2E] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* Top Header with Safe Area */}
      <div className="bg-[#0A0C10] px-3.5 sm:px-6 py-2.5 sm:py-4 flex items-center justify-between border-b border-white/10 pt-[max(env(safe-area-inset-top),10px)]">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onClose}
            className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-lg active:bg-white/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Back to Files"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-xs sm:text-sm">Document Viewers</h2>
            <p className="text-[10px] text-slate-400 hidden sm:block">Excel spreadsheets, PPT slide decks, EPUB e-books, DOCX</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls,.csv,.pptx,.ppt,.epub,.docx,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm min-h-[38px]"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs shadow-sm">
        <button
          onClick={() => setActiveTab('excel')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'excel' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Excel & CSV Sheets</span>
        </button>

        <button
          onClick={() => setActiveTab('ppt')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'ppt' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>PPT Slides Presenter</span>
        </button>

        <button
          onClick={() => setActiveTab('epub')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'epub' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>EPUB & E-Book Reader</span>
        </button>

        <button
          onClick={() => setActiveTab('docx')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'docx' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>DOCX Document Viewer</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-auto p-6 bg-slate-100/70">
        {/* EXCEL TAB */}
        {activeTab === 'excel' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              {/* Sheet selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Sheets:</span>
                <div className="flex gap-1">
                  {excelSheets.map((sheet) => (
                    <button
                      key={sheet}
                      onClick={() => setActiveSheet(sheet)}
                      className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                        activeSheet === sheet ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sheet}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search */}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={excelSearch}
                  onChange={(e) => setExcelSearch(e.target.value)}
                  placeholder="Filter rows & cells..."
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
                      <th className="py-2.5 px-3 border-r border-gray-200 w-12 text-center text-gray-400 font-mono">#</th>
                      {excelData[0]?.map((col, idx) => (
                        <th key={idx} className="py-2.5 px-4 border-r border-gray-200 font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExcelRows.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors">
                        <td className="py-2.5 px-3 border-r border-gray-200 text-center text-gray-400 font-mono text-[11px]">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, colIdx) => (
                          <td key={colIdx} className="py-2.5 px-4 border-r border-gray-200 text-gray-800">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PPT TAB */}
        {activeTab === 'ppt' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden aspect-video flex flex-col justify-between p-8 md:p-14 relative bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
                  Slide {currentSlide} of {slides.length}
                </span>
                <span className="text-xs font-serif text-slate-400">DocuStudio Deck</span>
              </div>

              <div className="space-y-4 my-auto">
                <h2 className="font-serif text-2xl md:text-4xl font-bold text-white">
                  {slides[currentSlide - 1].title}
                </h2>
                <p className="text-indigo-200 text-sm md:text-base font-medium">
                  {slides[currentSlide - 1].subtitle}
                </p>
                <div className="pt-4 space-y-2">
                  {slides[currentSlide - 1].points.map((pt, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs md:text-sm text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
                <span>Presenter Notes: {slides[currentSlide - 1].notes}</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <button
                onClick={() => setCurrentSlide(Math.max(1, currentSlide - 1))}
                disabled={currentSlide <= 1}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Slide</span>
              </button>

              <div className="flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i + 1)}
                    className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                      currentSlide === i + 1 ? 'bg-indigo-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide(Math.min(slides.length, currentSlide + 1))}
                disabled={currentSlide >= slides.length}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-xs font-semibold text-gray-700 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Next Slide</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* EPUB TAB */}
        {activeTab === 'epub' && (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Reading controls */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-semibold">Theme:</span>
                <button
                  onClick={() => setEbookTheme('light')}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                    ebookTheme === 'light' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setEbookTheme('sepia')}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                    ebookTheme === 'sepia' ? 'bg-[#D2B48C] text-amber-950 font-bold' : 'bg-[#FBF0D9] text-amber-900'
                  }`}
                >
                  Sepia Book
                </button>
                <button
                  onClick={() => setEbookTheme('dark')}
                  className={`px-3 py-1 rounded text-xs font-medium cursor-pointer ${
                    ebookTheme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  Night Mode
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-semibold">Font:</span>
                <button
                  onClick={() => setEbookFontSize(Math.max(12, ebookFontSize - 2))}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold cursor-pointer"
                >
                  A-
                </button>
                <button
                  onClick={() => setEbookFontSize(Math.min(24, ebookFontSize + 2))}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-bold cursor-pointer"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Book Body */}
            <div className={`p-8 md:p-14 rounded-2xl shadow-xl border transition-all ${
              ebookTheme === 'sepia' ? 'bg-[#FBF0D9] text-[#43302B] border-[#E8DCC4]' :
              ebookTheme === 'dark' ? 'bg-[#16181D] text-slate-200 border-white/10' :
              'bg-white text-gray-900 border-gray-200'
            }`}>
              <h1 className="font-serif text-3xl font-bold mb-2">Chapter 1: The Paperless Paradigm</h1>
              <p className="text-xs uppercase tracking-wider mb-8 opacity-60">From DocuStudio Reader Series</p>

              <div className="space-y-4 leading-relaxed font-serif" style={{ fontSize: `${ebookFontSize}px` }}>
                <p>
                  In the early decades of commercial bureaucracy, transactions required thick carbon copies, heavy filing cabinets, and courier services that traversed continents over several weeks.
                </p>
                <p>
                  Today, the portable document standard preserves typographic accuracy and cryptographic signature authenticity directly inside distributed networks. Documents can be verified, notarized, and audited in fractions of a second.
                </p>
                <p>
                  "Simplicity and fidelity remain the timeless hallmarks of legitimate agreements."
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DOCX TAB */}
        {activeTab === 'docx' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white p-8 md:p-14 rounded-2xl border border-gray-200 shadow-xl text-gray-800 space-y-4">
              <div className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-center">
                <h1 className="font-serif text-2xl font-bold text-gray-900">MASTER SERVICES AGREEMENT (DOCX)</h1>
                <span className="text-xs text-gray-500 font-mono">Word Count: 142</span>
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {docxContent}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
