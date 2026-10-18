import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  Type, 
  CheckSquare, 
  PenTool, 
  Save, 
  Trash2, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Undo2,
  FileCheck,
  Sparkles,
  Download
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
  const [fileName, setFileName] = useState<string>('document.pdf');
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([]);
  const [activeTool, setActiveTool] = useState<'text' | 'checkbox' | 'signature'>('text');
  
  // Text options
  const [inputText, setInputText] = useState<string>('Adeola Johnson - Verified');
  const [fontSize, setFontSize] = useState<number>(14);
  const [fontColor, setFontColor] = useState<string>('#1E1B4B');

  // Checkmark options
  const [checkType, setCheckType] = useState<'check' | 'cross' | 'approved'>('check');

  // Signature state
  const [sigMode, setSigMode] = useState<'draw' | 'type'>('draw');
  const [typedSigText, setTypedSigText] = useState<string>('TeaJay Konsult');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Status & logs
  const [logs, setLogs] = useState<string[]>(['DocuStudio PDF Engine ready.']);
  const [statusMessage, setStatusMessage] = useState<{ type: 'info' | 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfDocRef = useRef<any>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev.slice(-30), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const showStatus = (type: 'info' | 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    addLog(text);
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // Safe PDF.js initialization
  const loadPdfDocument = async (buffer: ArrayBuffer, docName: string) => {
    setLoading(true);
    addLog(`Loading document: ${docName} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);

    try {
      const pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) {
        throw new Error('PDF rendering library is initializing. Please wait a moment.');
      }

      try {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } catch (e) {
        console.warn('Worker configuration notice:', e);
      }

      // CRITICAL: Must wrap buffer in Uint8Array for PDF.js web worker compatibility
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

      showStatus('success', `PDF loaded successfully (${doc.numPages} ${doc.numPages === 1 ? 'page' : 'pages'}). Click on the document to edit.`);
    } catch (err: any) {
      console.error('PDF Load Error:', err);
      showStatus('error', err.message || 'Error parsing PDF document.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      showStatus('error', 'Please choose a valid PDF file (.pdf)');
      return;
    }
    const buffer = await uploadedFile.arrayBuffer();
    await loadPdfDocument(buffer, uploadedFile.name);
  };

  // Quick load of sample agreement
  const handleLoadSample = async () => {
    try {
      setLoading(true);
      addLog('Generating clean sample agreement PDF...');
      const sample = await generateSamplePdf();
      await loadPdfDocument(sample.buffer, sample.name);
      showStatus('success', 'Sample Agreement loaded! Select Text, Checkmark, or Signature to edit.');
    } catch (err: any) {
      showStatus('error', 'Failed to generate sample PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render current page onto canvas
  const renderPage = async (pageNumber: number) => {
    if (!pdfDocRef.current || !canvasRef.current) return;

    try {
      const page = await pdfDocRef.current.getPage(pageNumber);
      const containerWidth = Math.min(850, window.innerWidth - 64);
      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = containerWidth / unscaledViewport.width;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      // Draw annotations for this page
      const pageAnnots = annotations.filter((a) => a.page === pageNumber);
      pageAnnots.forEach((a) => {
        if (a.type === 'text' && a.text) {
          ctx.font = `600 ${a.size || 14}px 'Inter', sans-serif`;
          ctx.fillStyle = a.color || '#1E1B4B';
          ctx.fillText(a.text, a.x, a.y);
        } else if (a.type === 'checkbox') {
          // Draw check badge
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
      console.error('Render error:', err);
    }
  };

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage);
    }
  }, [currentPage, annotations]);

  // Handle clicking on PDF canvas to stamp text/checkbox/signature
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Scale client click coordinates to actual internal canvas pixel resolution
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (activeTool === 'text') {
      if (!inputText.trim()) {
        showStatus('info', 'Enter text in the toolbar above first.');
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
        color: fontColor
      };
      setAnnotations((prev) => [...prev, newAnnot]);
      addLog(`Stamped text: "${inputText}" at (${Math.round(x)}, ${Math.round(y)})`);
    } else if (activeTool === 'checkbox') {
      let markSymbol = '✓';
      if (checkType === 'cross') markSymbol = '✗';
      if (checkType === 'approved') markSymbol = 'OK';

      const newAnnot: PDFAnnotation = {
        id: 'ann_' + Date.now(),
        page: currentPage,
        type: 'checkbox',
        x,
        y,
        text: markSymbol
      };
      setAnnotations((prev) => [...prev, newAnnot]);
      addLog(`Stamped checkmark [${markSymbol}] at (${Math.round(x)}, ${Math.round(y)})`);
    } else if (activeTool === 'signature') {
      let sigImage = signatureDataUrl;

      // If in typed signature mode, generate image from text
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
        showStatus('info', 'Please sign or type your name in the signature box on the right first.');
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
      addLog(`Placed signature stamp at (${Math.round(x)}, ${Math.round(y)})`);
    }
  };

  // Drawing pad handlers
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
    const popped = annotations[annotations.length - 1];
    setAnnotations((prev) => prev.slice(0, -1));
    addLog(`Undid last annotation (${popped.type})`);
  };

  // Save modified PDF using pdf-lib
  const handleSavePDF = async () => {
    if (!fileData) {
      showStatus('error', 'No PDF loaded to save.');
      return;
    }

    setLoading(true);
    addLog('Compiling PDF modifications with pdf-lib...');

    try {
      const pdfDoc = await PDFDocument.load(fileData);
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
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
            // Draw clean box
            page.drawRectangle({
              x: pdfX - 10,
              y: pdfY - 4,
              width: 18,
              height: 18,
              borderColor: rgb(0.3, 0.35, 0.8),
              borderWidth: 1.5,
              color: rgb(0.95, 0.96, 1.0)
            });

            // Draw checkmark lines
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
              // Classic checkmark ✓
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
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const downloadName = fileName.replace('.pdf', '') + '_signed.pdf';
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showStatus('success', `Exported successfully: ${downloadName}`);
      onActionUsed('PDF Fill & Sign', downloadName, (blob.size / 1024).toFixed(1) + ' KB');
    } catch (err: any) {
      console.error(err);
      showStatus('error', 'Error compiling PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FA] text-[#1A1A2E] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
      {/* Top Header */}
      <div className="bg-[#0A0C10] px-6 py-3.5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <PenTool className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">DocuStudio PDF Editor &amp; Form Suite</h2>
            <p className="text-[11px] text-slate-400">Fill forms, stamp checkmarks, place signatures, compile to PDF</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!fileData && (
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Sample Agreement</span>
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

      {/* Tools Ribbon */}
      <div className="bg-white border-b border-gray-200 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        {/* Tool selector buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTool('text')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTool === 'text' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text Tool</span>
          </button>

          <button
            onClick={() => setActiveTool('checkbox')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTool === 'checkbox' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Checkmark Tool</span>
          </button>

          <button
            onClick={() => setActiveTool('signature')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTool === 'signature' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Signature Tool</span>
          </button>
        </div>

        {/* Dynamic Context Controls */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type text to stamp on click..."
              className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="px-2 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800"
            >
              <option value="12">12 pt</option>
              <option value="14">14 pt</option>
              <option value="16">16 pt</option>
              <option value="20">20 pt</option>
            </select>
          </div>
        )}

        {activeTool === 'checkbox' && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-semibold">Stamp Style:</span>
            <button
              onClick={() => setCheckType('check')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                checkType === 'check' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              ✓ Checkmark
            </button>
            <button
              onClick={() => setCheckType('cross')}
              className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                checkType === 'cross' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              ✗ Cross
            </button>
          </div>
        )}

        {/* Global Save / Clear / Page Navigation */}
        <div className="flex items-center gap-2">
          {numPages > 1 && (
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg mr-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-1 disabled:opacity-30 cursor-pointer text-gray-700"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-medium text-gray-700">
                {currentPage}/{numPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
                disabled={currentPage >= numPages}
                className="p-1 disabled:opacity-30 cursor-pointer text-gray-700"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleUndo}
            disabled={annotations.length === 0}
            title="Undo last stamp"
            className="p-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (confirm('Clear all placed annotations?')) {
                setAnnotations([]);
                addLog('Cleared all annotations');
              }
            }}
            disabled={annotations.length === 0}
            className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-30 flex items-center gap-1 font-medium cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear ({annotations.length})</span>
          </button>

          <button
            onClick={handleSavePDF}
            disabled={!fileData || loading}
            className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{loading ? 'Processing...' : 'Save & Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Notifications bar */}
      {statusMessage && (
        <div className={`px-6 py-2 text-xs font-medium flex items-center gap-2 transition-all ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-b border-emerald-200' :
          statusMessage.type === 'error' ? 'bg-rose-50 text-rose-700 border-b border-rose-200' :
          'bg-indigo-50 text-indigo-700 border-b border-indigo-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Workspace: Left is PDF Canvas, Right is Signature Panel */}
      <div className="flex-1 overflow-auto p-6 flex flex-col md:flex-row items-start justify-center gap-6 bg-slate-100/70">
        {!fileData ? (
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
                Upload PDF to Fill &amp; Sign
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Drag and drop your file here, or click to choose from your computer.
              </p>
              <button
                type="button"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                Choose PDF Document
              </button>
            </div>

            {/* Quick Sample Button */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 text-center space-y-2">
              <p className="text-xs text-gray-500">Don't have a PDF ready to upload?</p>
              <button
                type="button"
                onClick={handleLoadSample}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Load Sample Agreement Form (1-Click Test)</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* PDF Canvas View */}
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-2 text-xs text-gray-600 font-medium bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm">
                👉 Click anywhere on the document below to place your <strong className="text-indigo-600 capitalize">{activeTool}</strong>
              </div>
              <div className="bg-white p-2 rounded-xl shadow-xl border border-gray-200">
                <canvas 
                  ref={canvasRef} 
                  onClick={handleCanvasClick}
                  className="rounded cursor-crosshair max-w-full"
                />
              </div>
            </div>

            {/* Signature Draw Sidebar if signature tool is active */}
            {activeTool === 'signature' && (
              <div className="w-full md:w-80 bg-white border border-gray-200 rounded-xl p-4 shadow-lg shrink-0 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-indigo-600" />
                    Signature Studio
                  </h4>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-lg text-xs">
                  <button
                    onClick={() => setSigMode('draw')}
                    className={`flex-1 py-1 rounded font-semibold cursor-pointer ${
                      sigMode === 'draw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Draw Signature
                  </button>
                  <button
                    onClick={() => setSigMode('type')}
                    className={`flex-1 py-1 rounded font-semibold cursor-pointer ${
                      sigMode === 'type' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    Type Name
                  </button>
                </div>

                {sigMode === 'draw' ? (
                  <>
                    <p className="text-[11px] text-gray-500">
                      Sign with mouse or touch screen below:
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                      <canvas
                        ref={sigCanvasRef}
                        width={300}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                        className="w-full h-28 bg-white cursor-crosshair touch-none"
                      />
                    </div>
                    <button
                      onClick={clearSignaturePad}
                      className="w-full py-1.5 px-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-medium cursor-pointer"
                    >
                      Clear Pad
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-gray-600">Your Full Name:</label>
                    <input
                      type="text"
                      value={typedSigText}
                      onChange={(e) => setTypedSigText(e.target.value)}
                      placeholder="e.g. Adeola Johnson"
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs"
                    />
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center font-serif italic text-xl text-indigo-950">
                      {typedSigText || 'Your Signature'}
                    </div>
                  </div>
                )}

                <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg text-[11px] text-indigo-800">
                  ✅ Signature ready! Click on the document where you want it placed.
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Console Log */}
      <div className="bg-[#0A0C10] border-t border-white/10 px-6 py-2 max-h-20 overflow-y-auto font-mono text-[11px] text-emerald-400">
        {logs.map((log, index) => (
          <div key={index} className="truncate">
            &gt; {log}
          </div>
        ))}
      </div>
    </div>
  );
};
