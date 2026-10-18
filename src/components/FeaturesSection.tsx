import React from 'react';
import { 
  FileText, 
  PenTool, 
  FileEdit, 
  FileSpreadsheet, 
  ArrowRight, 
  Check, 
  Sparkles,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { ToolType } from '../types';

interface FeaturesSectionProps {
  onOpenTool: (tool: ToolType) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onOpenTool }) => {
  const tools = [
    {
      id: 'pdf-viewer' as ToolType,
      title: 'PDF Viewer & Reader',
      description: 'Upload and inspect multi-page documents with crisp vector clarity, smooth zoom, page jumps, rotation, and printing.',
      icon: <FileText className="w-6 h-6 text-indigo-400" />,
      tag: 'Ready • Free & Pro',
      features: ['Zoom up to 250%', 'Page jump & navigation', '90° rotation', 'Direct browser print']
    },
    {
      id: 'pdf-editor-tools' as ToolType,
      title: 'PDF Editor, Fill & Sign',
      description: 'Fill out interactive forms, place text fields, stamp checkmarks, and sign documents with your mouse or touchscreen.',
      icon: <PenTool className="w-6 h-6 text-emerald-400" />,
      tag: 'Most Popular',
      popular: true,
      features: ['Text insertion & styling', 'Digital signature canvas', 'Form checkmarks (✓)', 'Real PDF-Lib binary export']
    },
    {
      id: 'text-editor' as ToolType,
      title: 'Rich Text & Document Editor',
      description: 'Draft notes, agreements, and proposals with clean formatting controls. Export directly to HTML, plain text, or print-ready PDF.',
      icon: <FileEdit className="w-6 h-6 text-amber-400" />,
      tag: 'WYSIWYG',
      features: ['Full typography controls', 'Word & character counter', 'Reading time estimate', 'Multi-format downloads']
    },
    {
      id: 'document-viewers' as ToolType,
      title: 'Multi-Format Viewers',
      description: 'Open Excel spreadsheets (.xlsx, .csv), PowerPoint slide decks (.pptx), EPUB e-books, and Word documents in one place.',
      icon: <FileSpreadsheet className="w-6 h-6 text-teal-400" />,
      tag: 'Excel • PPT • EPUB • DOCX',
      features: ['SheetJS spreadsheet parser', 'Slide deck presenter', 'Light / Sepia / Dark reader', 'DOCX agreement viewer']
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
          All the document power you need
        </h2>
        <p className="text-sm text-slate-400">
          Everything runs entirely within your browser for lightning speed and total document privacy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className={`relative rounded-2xl bg-[#16181D] border p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-2xl ${
              tool.popular 
                ? 'border-indigo-500/40 shadow-lg shadow-indigo-500/10' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            {tool.popular && (
              <span className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                Featured
              </span>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                {tool.icon}
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  {tool.tag}
                </span>
                <h3 className="font-serif font-bold text-lg text-white mb-2">
                  {tool.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-white/5 text-xs text-slate-300">
                {tool.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => onOpenTool(tool.id)}
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer group"
            >
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
