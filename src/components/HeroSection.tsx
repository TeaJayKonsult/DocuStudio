import React from 'react';
import { ArrowRight, CheckCircle2, Sparkles, FileText, Shield, Zap, FileCheck, Layers } from 'lucide-react';
import { ActivePage, ToolType } from '../types';

interface HeroSectionProps {
  onOpenAuth: (isSignUp?: boolean) => void;
  onOpenTool: (tool: ToolType) => void;
  setActivePage: (page: ActivePage) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenAuth,
  onOpenTool,
  setActivePage
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Hero Text & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            <span>All-In-One Document &amp; PDF Suite</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
            Work with documents <br className="hidden sm:inline" />
            <span className="italic text-indigo-400">faster, safer,</span> and smarter.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
            The PDF-first document workspace that does it all. Fill forms, sign contracts, review spreadsheets, view presentations, and format documents with pro-grade fidelity.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onOpenTool('pdf-editor-tools')}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
            >
              <span>Launch PDF Fill &amp; Sign</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('tools')}
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              Explore All Tools
            </button>
          </div>

          {/* Trust bullets */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>5 Free Actions / Month</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Client-Side Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant Cloud &amp; PWA</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Mockup Card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl bg-[#16181D] border border-white/10 shadow-2xl p-5 overflow-hidden group">
            {/* Window titlebar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-mono text-slate-400 ml-2">contract_agreement.pdf</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                Verified
              </span>
            </div>

            {/* Document preview canvas simulation */}
            <div className="py-6 space-y-4">
              <div className="h-6 w-3/4 bg-white/10 rounded"></div>
              <div className="h-3 w-full bg-white/5 rounded"></div>
              <div className="h-3 w-5/6 bg-white/5 rounded"></div>

              {/* Form Checkbox simulation */}
              <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    ✓
                  </div>
                  <span className="text-xs text-indigo-200 font-medium">Terms &amp; Conditions Accepted</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-300">Signed</span>
              </div>

              {/* Digital signature stamp badge */}
              <div className="bg-[#0A0C10] border border-white/10 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Authorized Signature</div>
                  <div className="font-serif italic text-lg text-indigo-400">TeaJay Konsult</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <FileCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Quick Launch Buttons inside mockup */}
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenTool('pdf-viewer')}
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-slate-300 text-center cursor-pointer transition-colors"
                >
                  📄 View PDF
                </button>
                <button
                  onClick={() => onOpenTool('text-editor')}
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-slate-300 text-center cursor-pointer transition-colors"
                >
                  ✏️ Text Editor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
