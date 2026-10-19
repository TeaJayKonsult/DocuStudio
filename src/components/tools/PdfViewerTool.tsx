import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Printer, 
  FileText, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../../types';
import { generateSamplePdf } from '../../utils/samplePdf';

interface PdfViewerToolProps {
  currentUser: UserProfile | null;
  onActionUsed: (actionName: string, fileName: string, fileSize?: string) => void;
  onClose: () => void;
}

export const PdfViewerTool: React.FC<PdfViewerToolProps> = ({
  currentUser,
  onActionUsed,
  onClose
}) => {
  const [file, setFile] = useState<File | Blob | null>(null);
  const [fileName, setFileName] = useState<string>('Document.pdf');
  const [fileSize, setFileSize] = useState<string>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadPdfFromBuffer = async (buffer: ArrayBuffer, name: string, sizeStr: string, rawBlob?: Blob) => {
    setError(null);
    setLoading(true);
    setFileName(name);
    setFileSize(sizeStr);
    if (rawBlob) setFile(rawBlob);

    try {
      const pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) throw new Error('PDF rendering engine initializing. Please retry in a second.');

      try {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } catch (e) {}

      const typedArray = new Uint8Array(buffer);
      const doc = await pdfjs.getDocument({
        data: typedArray,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true
      }).promise;

      setPdfDoc(doc);
      setNumPages(doc.numPages);
      setPageNum(1);
      onActionUsed('PDF Viewed', name, sizeStr);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load PDF file.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a valid PDF document (.pdf)');
      return;
    }
    const arrayBuffer = await selectedFile.arrayBuffer();
    await loadPdfFromBuffer(
      arrayBuffer,
      selectedFile.name,
      (selectedFile.size / 1024).toFixed(1) + ' KB',
      selectedFile
    );
  };

  const handleLoadSample = async () => {
    try {
      setLoading(true);
      const sample = await generateSamplePdf();
      const blob = new Blob([sample.buffer], { type: 'application/pdf' });
      await loadPdfFromBuffer(
        sample.buffer,
        sample.name,
        (sample.buffer.byteLength / 1024).toFixed(1) + ' KB',
        blob
      );
    } catch (err: any) {
      setError('Could not generate sample PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async (pageNumber: number, currentScale: number, currentRotation: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    try {
      const page = await pdfDoc.getPage(pageNumber);
      const maxAllowedWidth = Math.min(850, window.innerWidth - 32);
      const unscaledViewport = page.getViewport({ scale: 1, rotation: currentRotation });
      const computedScale = (maxAllowedWidth / unscaledViewport.width) * (currentScale / 1.1);
      const viewport = page.getViewport({ scale: computedScale, rotation: currentRotation });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (err) {
      console.error('Page render error', err);
    }
  };

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNum, scale, rotation);
    }
  }, [pdfDoc, pageNum, scale, rotation]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#181A20] text-slate-100 select-none overflow-hidden relative">
      {/* Top Mobile App Header */}
      <header className="bg-[#0D0F14] border-b border-white/10 px-3 flex items-center justify-between shrink-0 z-30 pt-[max(env(safe-area-inset-top),0px)] min-h-[52px]">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 -ml-1 text-slate-300 hover:text-white rounded-lg active:bg-white/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Back to Files"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="font-semibold text-xs text-white truncate max-w-[150px] sm:max-w-xs">
              {fileName}
            </span>
            <span className="text-[10px] text-slate-400">
              {numPages > 0 ? `Page ${pageNum} of ${numPages}` : 'PDF Viewer'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {file && (
            <>
              <button
                onClick={handlePrint}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer min-h-[40px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main View Area */}
      <div className="flex-1 overflow-auto bg-[#242731] flex flex-col items-center justify-start p-3 sm:p-6 relative">
        {error && (
          <div className="w-full max-w-sm mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!pdfDoc ? (
          <div className="my-auto max-w-sm w-full p-6 bg-[#161820] border border-white/10 rounded-2xl text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Open PDF Document</h3>
              <p className="text-xs text-slate-400 mt-1">High-resolution vector reader with zoom &amp; search</p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              accept=".pdf"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 cursor-pointer min-h-[44px]"
            >
              Choose PDF File
            </button>

            <div className="pt-2 border-t border-white/5">
              <button
                onClick={handleLoadSample}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-indigo-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Load Sample Document</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center pb-20">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-300">
              <canvas ref={canvasRef} className="max-w-full block" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Mobile Floating Controls Bar */}
      {pdfDoc && (
        <div className="bg-[#0D0F14] border-t border-white/10 px-4 py-2 shrink-0 z-30 flex items-center justify-between text-xs pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScale(Math.max(0.6, scale - 0.2))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300 text-xs px-2">{Math.round((scale / 1.1) * 100)}%</span>
            <button
              onClick={() => setScale(Math.min(2.5, scale + 0.2))}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation((rotation + 90) % 360)}
              className="p-2 ml-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title="Rotate"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Page navigation buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPageNum(Math.max(1, pageNum - 1))}
              disabled={pageNum <= 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-white px-1 text-xs">
              {pageNum} / {numPages}
            </span>
            <button
              onClick={() => setPageNum(Math.min(numPages, pageNum + 1))}
              disabled={pageNum >= numPages}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-20 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
