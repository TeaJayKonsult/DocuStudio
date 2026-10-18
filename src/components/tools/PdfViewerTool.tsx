import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  Printer, 
  FileText, 
  AlertCircle,
  Sparkles,
  X
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
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNum, setPageNum] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
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
      if (!pdfjs) {
        throw new Error('PDF rendering engine is initializing. Please retry in a second.');
      }
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } catch (e) {
        console.warn('Worker configuration notice:', e);
      }

      // CRITICAL: Uint8Array ensures web worker compatibility
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
      const viewport = page.getViewport({ scale: currentScale, rotation: currentRotation });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      await page.render(renderContext).promise;
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
    <div className="flex flex-col h-full bg-[#F8F9FA] text-[#1A1A2E] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* Header */}
      <div className="bg-[#0A0C10] px-6 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">DocuStudio PDF Viewer</h2>
            <p className="text-[11px] text-slate-400">High-resolution vector PDF renderer &amp; reader</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!pdfDoc && (
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Sample</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {pdfDoc && (
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
          {/* File info */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 truncate max-w-xs">{fileName}</span>
            <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded text-[11px]">{fileSize}</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setPageNum(Math.max(1, pageNum - 1))}
              disabled={pageNum <= 1}
              className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer text-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium text-gray-700">
              Page {pageNum} of {numPages}
            </span>
            <button
              onClick={() => setPageNum(Math.min(numPages, pageNum + 1))}
              disabled={pageNum >= numPages}
              className="p-1 rounded hover:bg-white disabled:opacity-30 cursor-pointer text-gray-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom & Rotate */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setScale(Math.max(0.6, scale - 0.2))}
              title="Zoom Out"
              className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-gray-600 font-mono text-[11px]">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(Math.min(2.5, scale + 0.2))}
              title="Zoom In"
              className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation((rotation + 90) % 360)}
              title="Rotate Clockwise"
              className="p-1.5 ml-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center gap-1 font-medium cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 font-medium cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-start bg-slate-100/70">
        {error && (
          <div className="w-full max-w-xl mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!pdfDoc ? (
          <div className="my-auto max-w-lg w-full flex flex-col gap-4">
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className="bg-white border-2 border-dashed border-gray-300 hover:border-indigo-500 rounded-2xl p-10 text-center cursor-pointer transition-all hover:shadow-xl hover:bg-indigo-50/20 group"
            >
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-800 mb-1">
                Select or Drop a PDF File
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                View contracts, invoices, certificates, and multi-page documents instantly.
              </p>
              <button
                type="button"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
              >
                Choose PDF Document
              </button>
            </div>

            {/* Quick Sample Button */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center space-y-2">
              <p className="text-xs text-gray-500">Need a document to test right now?</p>
              <button
                type="button"
                onClick={handleLoadSample}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Load Sample Document (1-Click Test)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-200">
            <canvas ref={canvasRef} className="max-w-full rounded shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
};
