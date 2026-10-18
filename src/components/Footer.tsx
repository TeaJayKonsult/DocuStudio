import React from 'react';
import { FileText, Shield, Mail, Phone, Heart } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-[#0A0C10] border-t border-white/10 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg text-white">DocuStudio</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400">by TeaJay Konsult</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The PDF-first document workspace that does it all. Fill forms, sign, edit, convert, and collaborate securely in your browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Shield className="w-3.5 h-3.5" />
              <span>Zero-knowledge client encryption</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase">Document Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('tools')} className="hover:text-white transition-colors cursor-pointer">
                  PDF Viewer & Zoom
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tools')} className="hover:text-white transition-colors cursor-pointer">
                  PDF Fill & Sign Engine
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tools')} className="hover:text-white transition-colors cursor-pointer">
                  Rich Text & Note Editor
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tools')} className="hover:text-white transition-colors cursor-pointer">
                  Spreadsheet & Slides Viewer
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('tools')} className="hover:text-white transition-colors cursor-pointer">
                  EPUB & DOCX Reader
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActivePage('pricing')} className="hover:text-white transition-colors cursor-pointer">
                  Pricing & Pro Upgrade
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('blog')} className="hover:text-white transition-colors cursor-pointer">
                  DocuStudio Guides & Blog
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Help Center & Support
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  User Workspace
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase">Get in Touch</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <a href="mailto:teajaykonsult@gmail.com" className="hover:text-white">teajaykonsult@gmail.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                <span>+234 (0) 800 DOCUSTUDIO</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3">
                TeaJay Konsult, Enterprise Software & Cloud Consulting.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} DocuStudio by TeaJay Konsult. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for high-fidelity document workflows</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
