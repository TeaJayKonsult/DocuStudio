import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowLeft,
  Type, 
  CheckSquare, 
  PenTool, 
  Save, 
  Trash2, 
  Undo2, 
  Sparkles, 
  Download,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { UserProfile, PDFAnnotation } from '../../types';
import { generateSamplePdf } from '../../utils/samplePdf';

interface PdfEditorToolProps {
  currentUser: UserProfile | null;
  onActionUsed: (actionName: string, fileName: string, fileSize?: string) => void;
  onClose: () => void;
}

export const PdfEditorTool: React.FC<PdfEditorToolProps> = ({
  currentUser,
  onActionUsed,
  onClose
}) => {
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState<string>('Document.pdf');
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([]);
  const [activeTool, setActiveTool] = useState<'text' | 'checkbox' | 'signature'>('text');
  
  // Text options
  const [inputText, setInputText] = useState<string>('Verified & Approved');
  const [fontSize, setFontSize] = useState<number>(14);

  // Checkmark options
  const [checkType, setCheckType] = useState<'check' | 'cross'>('check');

  // Signature state & Bottom Sheet
  const [sigSheetOpen, setSigSheetOpen] = useState<boolean>(false);
  const [sigMode, setSigMode] = useState<'draw' | 'type'>('draw');
  const [typedSigText, setTypedSigText] = useState<string>(currentUser?.displayName || 'TeaJay Konsult');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Status message
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfDocRef = useRef<any>(null);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3500);
  };

  // Safe PDF.js initialization
  const loadPdfDocument = async (buffer: ArrayBuffer, docName: string) => {
    setLoading(true);
    try {
      const pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) throw new Error('PDF viewer initializing. Please retry in a second.');

      try {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } catch (e) {}

      const typedArray = new Uint8Array(buffer);
      const loadingTask = pdfjs.getDocument({
        data: typedArray,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true,
      });

      const doc = await loadingTask.promise;
      pdfDocRef.current = doc;
      setFileData(buffer);
      setFileName(docName);
      setNumPages(doc.numPages);
      setCurrentPage(1);
      setAnnotations([]);
      showToast('success', `Opened ${docName} (${doc.numPages} ${doc.numPages === 1 ? 'page' : 'pages'})`);
    } catch (err: any) {
      console.error(err);
      showToast('error', err.message || 'Error opening PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      showToast('error', 'Please choose a PDF file');
      return;
    }
    const buffer = await uploadedFile.arrayBuffer();
    await loadPdfDocument(buffer, uploadedFile.name);
  };

  const handleLoadSample = async () => {
    setLoading(true);
    try {
      const sample = await generateSamplePdf();
      await loadPdfDocument(sample.buffer, sample.name);
    } catch (err: any) {
      showToast('error', 'Sample generation error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render current page onto canvas
  const renderPage = async (pageNumber: number) => {
    if (!pdfDocRef.current || !canvasRef.current) return;

    try {
      const page = await pdfDocRef.current.getPage(pageNumber);
      // Mobile-optimized container width: adapts to screen size
      const maxAllowedWidth = Math.min(800, window.innerWidth - 32);
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = maxAllowedWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Draw annotations for current page
      const pageAnnots = annotations.filter((a) => a.page === pageNumber);
      pageAnnots.forEach((a) => {
        if (a.type === 'text' && a.text) {
          ctx.font = `bold ${a.size || 14}px sans-serif`;
          ctx.fillStyle = a.color || '#1E1B4B';
          ctx.fillText(a.text, a.x, a.y);
        } else if (a.type === 'checkbox') {
          // Rounded checkmark badge
          ctx.fillStyle = '#EEF2FF';
          ctx.strokeStyle = '#4F46E5';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(a.x - 12, a.y - 14, 24, 24, 4);
          ctx.fill();
          ctx.stroke();

          ctx.font = 'bold 16px Arial, sans-serif';
          ctx.fillStyle = '#4F46E5';
          ctx.textAlign = 'center';
          ctx.fillText(a.text || '✓', a.x, a.y + 4);
          ctx.textAlign = 'start';
        } else if (a.type === 'signature' && a.imageData) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, a.x - 65, a.y - 30, 130, 60);
          };
          img.src = a.imageData;
        }
      });
    } catch (err) {
      console.error('Page render error:', err);
    }
  };

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage);
    }
  }, [currentPage, annotations]);

  // Unified click & touch event handler for accurate coordinate mapping
  const stampAtPoint = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    if (activeTool === 'text') {
      if (!inputText.trim()) {
        showToast('info', 'Type your text in the bottom bar first');
        return;
      }
      const newAnnot: PDFAnnotation = {
        id: 'ann_' + Date.now(),
        page: currentPage,
        type: 'text',
        x,
        y,
        text: inputText,
        size: fontSize,
        color: '#1E1B4B'
      };
      setAnnotations((prev) => [...prev, newAnnot]);
      showToast('success', 'Text placed');
    } else if (activeTool === 'checkbox') {
      const markSymbol = checkType === 'cross' ? '✗' : '✓';
      const newAnnot: PDFAnnotation = {
        id: 'ann_' + Date.now(),
        page: currentPage,
        type: 'checkbox',
        x,
        y,
        text: markSymbol
      };
      setAnnotations((prev) => [...prev, newAnnot]);
      showToast('success', `Stamped ${markSymbol}`);
    } else if (activeTool === 'signature') {
      let sigImage = signatureDataUrl;

      if (sigMode === 'type' && typedSigText.trim()) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 320;
        tempCanvas.height = 100;
        const tctx = tempCanvas.getContext('2d');
        if (tctx) {
          tctx.font = 'italic bold 28px "Playfair Display", Georgia, cursive';
          tctx.fillStyle = '#1E1B4B';
          tctx.fillText(typedSigText, 20, 60);
          sigImage = tempCanvas.toDataURL('image/png');
        }
      }

      if (!sigImage) {
        setSigSheetOpen(true);
        showToast('info', 'Draw or type your signature below first');
        return;
      }

      const newAnnot: PDFAnnotation = {
        id: 'ann_' + Date.now(),
        page: currentPage,
        type: 'signature',
        x,
        y,
        imageData: sigImage
      };
      setAnnotations((prev) => [...prev, newAnnot]);
      showToast('success', 'Signature placed');
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    stampAtPoint(e.clientX, e.clientY);
  };

  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const touch = e.changedTouches[0];
      stampAtPoint(touch.clientX, touch.clientY);
    }
  };

  // Drawing Pad Handlers for Signature Sheet
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1E1B4B';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL('image/png'));
    }
  };

  const clearSignaturePad = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureDataUrl(null);
    }
  };

  const handleUndo = () => {
    if (annotations.length === 0) return;
    setAnnotations((prev) => prev.slice(0, -1));
    showToast('info', 'Undid last stamp');
  };

  // Save modified PDF using pdf-lib
  const handleSavePDF = async () => {
    if (!fileData) {
      showToast('error', 'No document to save');
      return;
    }

    setLoading(true);
    try {
      const pdfDoc = await PDFDocument.load(fileData);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const annot of annotations) {
        if (annot.page <= pages.length) {
          const page = pages[annot.page - 1];
          const { width, height } = page.getSize();
          
          const canvas = canvasRef.current;
          const scaleX = canvas ? width / canvas.width : 1;
          const scaleY = canvas ? height / canvas.height : 1;

          const pdfX = annot.x * scaleX;
          const pdfY = height - (annot.y * scaleY);

          if (annot.type === 'text' && annot.text) {
            page.drawText(annot.text, {
              x: pdfX,
              y: pdfY,
              size: (annot.size || 14) * 0.9,
              font: helveticaBold,
              color: rgb(0.12, 0.1, 0.3)
            });
          } else if (annot.type === 'checkbox') {
            page.drawRectangle({
              x: pdfX - 10,
              y: pdfY - 4,
              width: 18,
              height: 18,
              borderColor: rgb(0.3, 0.35, 0.8),
              borderWidth: 1.5,
              color: rgb(0.95, 0.96, 1.0)
            });

            if (annot.text === '✗') {
              page.drawLine({
                start: { x: pdfX - 7, y: pdfY + 11 },
                end: { x: pdfX + 5, y: pdfY - 1 },
                thickness: 2,
                color: rgb(0.85, 0.2, 0.2)
              });
              page.drawLine({
                start: { x: pdfX + 5, y: pdfY + 11 },
                end: { x: pdfX - 7, y: pdfY - 1 },
                thickness: 2,
                color: rgb(0.85, 0.2, 0.2)
              });
            } else {
              page.drawLine({
                start: { x: pdfX - 7, y: pdfY + 3 },
                end: { x: pdfX - 2, y: pdfY - 2 },
                thickness: 2,
                color: rgb(0.25, 0.35, 0.85)
              });
              page.drawLine({
                start: { x: pdfX - 2, y: pdfY - 2 },
                end: { x: pdfX + 6, y: pdfY + 10 },
                thickness: 2,
                color: rgb(0.25, 0.35, 0.85)
              });
            }
          } else if (annot.type === 'signature' && annot.imageData) {
            const pngImage = await pdfDoc.embedPng(annot.imageData);
            page.drawImage(pngImage, {
              x: pdfX - 50,
              y: pdfY - 20,
              width: 110,
              height: 45
            });
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const downloadName = fileName.replace('.pdf', '') + '_signed.pdf';
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('success', `Saved: ${downloadName}`);
      onActionUsed('PDF Fill & Sign', downloadName, (blob.size / 1024).toFixed(1) + ' KB');
    } catch (err: any) {
      console.error(err);
      showToast('error', 'Error generating PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#181A20] text-slate-100 select-none overflow-hidden relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-semibold shadow-xl border flex items-center gap-1.5 animate-fadeIn ${
          toast.type === 'success' ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40' :
          toast.type === 'error' ? 'bg-rose-950/90 text-rose-300 border-rose-500/40' :
          'bg-indigo-950/90 text-indigo-300 border-indigo-500/40'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.text}</span>
        </div>
      )}

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
              {numPages > 0 ? `Page ${currentPage} of ${numPages}` : 'PDF Form & Sign'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {annotations.length > 0 && (
            <button
              onClick={handleUndo}
              className="p-2 text-slate-400 hover:text-white rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
              title="Undo last stamp"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          {fileData && (
            <button
              onClick={handleSavePDF}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer transition-all min-h-[40px]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save & Export'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Document View Canvas */}
      <div className="flex-1 overflow-auto bg-[#242731] flex flex-col items-center justify-start p-3 sm:p-6 relative">
        {!fileData ? (
          <div className="my-auto max-w-sm w-full p-6 bg-[#161820] border border-white/10 rounded-2xl text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Select a PDF Document</h3>
              <p className="text-xs text-slate-400 mt-1">Open contracts, forms, or tax documents to fill &amp; sign</p>
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
                <span>Load Sample Agreement Form</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center pb-20">
            {/* Guide hint */}
            <div className="mb-2 text-[11px] text-indigo-200 bg-indigo-950/70 border border-indigo-500/30 px-3.5 py-1 rounded-full shadow-sm">
              Tap anywhere on the document to place <strong className="text-white capitalize">{activeTool}</strong>
            </div>

            {/* Canvas */}
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-300">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onTouchEnd={handleCanvasTouch}
                className="cursor-crosshair max-w-full block touch-manipulation"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Mobile Tool Ribbon (Natural Thumb Zone) */}
      {fileData && (
        <div className="bg-[#0D0F14] border-t border-white/10 px-3 py-2 shrink-0 z-30 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          {/* Active Context Row */}
          {activeTool === 'text' && (
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Text to stamp on tap..."
                className="flex-1 px-3 py-1.5 bg-[#161820] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 min-h-[38px]"
              />
              <select
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="px-2 py-1.5 bg-[#161820] border border-white/10 rounded-lg text-xs text-white min-h-[38px]"
              >
                <option value="12">12pt</option>
                <option value="14">14pt</option>
                <option value="18">18pt</option>
                <option value="22">22pt</option>
              </select>
            </div>
          )}

          {activeTool === 'checkbox' && (
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10 text-xs">
              <span className="text-slate-400 font-medium">Stamp Style:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCheckType('check')}
                  className={`px-3 py-1 rounded-lg font-bold min-h-[36px] cursor-pointer ${
                    checkType === 'check' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  ✓ Checkmark
                </button>
                <button
                  onClick={() => setCheckType('cross')}
                  className={`px-3 py-1 rounded-lg font-bold min-h-[36px] cursor-pointer ${
                    checkType === 'cross' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  ✗ Cross
                </button>
              </div>
            </div>
          )}

          {/* Bottom Primary Tool Buttons Bar */}
          <div className="grid grid-cols-5 gap-1 items-center">
            <button
              onClick={() => setActiveTool('text')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[48px] ${
                activeTool === 'text' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Type className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-semibold">Text</span>
            </button>

            <button
              onClick={() => setActiveTool('checkbox')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[48px] ${
                activeTool === 'checkbox' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <CheckSquare className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-semibold">Check</span>
            </button>

            <button
              onClick={() => {
                setActiveTool('signature');
                if (!signatureDataUrl) setSigSheetOpen(true);
              }}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all cursor-pointer min-h-[48px] ${
                activeTool === 'signature' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <PenTool className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-semibold">Sign</span>
            </button>

            {/* Page Jump */}
            <div className="flex flex-col items-center justify-center py-1 text-slate-400 min-h-[48px]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage <= 1}
                  className="p-1 disabled:opacity-20 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-bold text-white font-mono">
                  {currentPage}/{numPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                  disabled={currentPage >= numPages}
                  className="p-1 disabled:opacity-20 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-slate-500">Page</span>
            </div>

            <button
              onClick={() => {
                if (confirm('Clear all stamps?')) setAnnotations([]);
              }}
              disabled={annotations.length === 0}
              className="flex flex-col items-center justify-center py-1.5 rounded-xl text-slate-400 hover:text-rose-400 disabled:opacity-30 cursor-pointer min-h-[48px]"
            >
              <Trash2 className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-semibold">Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Signature Bottom Sheet (WPS / Android Mobile Style) */}
      {sigSheetOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full bg-[#161820] border-t border-white/10 rounded-t-3xl p-5 shadow-2xl space-y-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Create Digital Signature</h3>
              </div>
              <button
                onClick={() => setSigSheetOpen(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-[#0D0F14] p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSigMode('draw')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer min-h-[40px] ${
                  sigMode === 'draw' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Draw with Finger
              </button>
              <button
                onClick={() => setSigMode('type')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer min-h-[40px] ${
                  sigMode === 'type' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
                }`}
              >
                Type Cursive Name
              </button>
            </div>

            {sigMode === 'draw' ? (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-white/15 rounded-2xl bg-white overflow-hidden shadow-inner">
                  <canvas
                    ref={sigCanvasRef}
                    width={340}
                    height={140}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-32 bg-white cursor-crosshair touch-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={clearSignaturePad}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-300 font-semibold text-xs hover:bg-white/5 cursor-pointer min-h-[44px]"
                  >
                    Clear Drawing
                  </button>
                  <button
                    onClick={() => {
                      if (!signatureDataUrl) {
                        showToast('info', 'Please sign in the box first');
                        return;
                      }
                      setSigSheetOpen(false);
                      showToast('info', 'Signature ready! Tap document to place');
                    }}
                    disabled={!signatureDataUrl}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md cursor-pointer min-h-[44px]"
                  >
                    Use Signature
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={typedSigText}
                  onChange={(e) => setTypedSigText(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 bg-[#0D0F14] border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <div className="p-4 bg-white rounded-xl text-center font-serif italic text-2xl text-slate-900 shadow-inner">
                  {typedSigText || 'Your Signature'}
                </div>
                <button
                  onClick={() => {
                    setSigSheetOpen(false);
                    showToast('info', 'Signature ready! Tap document to place');
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md cursor-pointer min-h-[44px]"
                >
                  Use Cursive Signature
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
