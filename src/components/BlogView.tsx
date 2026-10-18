import React, { useState } from 'react';
import { BlogPost } from '../types';
import { BookOpen, Clock, ArrowRight, X, Sparkles } from 'lucide-react';

export const BlogView: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const posts: BlogPost[] = [
    {
      id: 'post-1',
      title: 'How to Digitally Sign PDFs with Zero-Knowledge Client Security',
      category: 'Security & Signatures',
      readTime: '4 min read',
      date: 'October 12, 2026',
      snippet: 'Traditional PDF signing tools upload your confidential agreements to remote cloud servers. Discover how browser-native PDF-lib compilation changes the security game.',
      content: [
        'When dealing with client agreements, non-disclosure contracts, or sensitive financial statements, uploading unencrypted documents to third-party multi-tenant servers introduces significant attack vectors.',
        'With modern WebAssembly and client-side JavaScript libraries like PDF-Lib, vector modifications and signature rasterization execute directly inside the user’s local browser sandbox.',
        'This means your document bytes never traverse intermediate intermediary APIs — ensuring complete compliance with global privacy regulations and internal data governance standards.'
      ]
    },
    {
      id: 'post-2',
      title: 'Paperless Office Workflows for Legal & Accounting Teams',
      category: 'Productivity',
      readTime: '5 min read',
      date: 'September 28, 2026',
      snippet: 'A practical roadmap to reducing document turnaround times from days to minutes across cross-border consulting engagements.',
      content: [
        'Document delays often happen in the friction between viewing, converting, and counter-signing files.',
        'By consolidating multi-format viewers (Spreadsheets, Word docs, and Presentation decks) into a single unified browser workbench, teams eliminate the need for bloated desktop licenses.',
        'Automated activity tracking also creates a reliable timeline of actions that can be audited during project reviews.'
      ]
    },
    {
      id: 'post-3',
      title: 'Parsing Massive Excel Workbooks Locally with SheetJS',
      category: 'Engineering & Data',
      readTime: '3 min read',
      date: 'September 15, 2026',
      snippet: 'Optimizing performance when rendering large tabular financial models in web applications without lag.',
      content: [
        'Large spreadsheets with dozens of sheets and hundreds of thousands of cells can easily freeze a standard web interface if not virtualized correctly.',
        'By leveraging binary array buffers and lazy tab extraction, DocuStudio allows instantaneous previewing and client-side filtering without heavy server round-trips.',
        'Combined with custom search queries, financial analysts can find key metrics without opening bulky desktop applications.'
      ]
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
          Articles &amp; Guides
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
          DocuStudio Insights
        </h1>
        <p className="text-sm text-slate-300">
          Best practices, technical deep-dives, and productivity guides for document professionals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="rounded-2xl bg-[#16181D] border border-white/10 p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="text-indigo-400 font-semibold">{post.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-white leading-snug">
                {post.title}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed">
                {post.snippet}
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">{post.date}</span>
              <button
                onClick={() => setSelectedPost(post)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#16181D] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-10 max-h-[85vh] overflow-y-auto text-slate-100">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-3 mb-6">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                {selectedPost.category} • {selectedPost.readTime}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                {selectedPost.title}
              </h2>
              <div className="text-xs text-slate-400">
                Published on {selectedPost.date} by TeaJay Konsult Research Team
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-6">
              {selectedPost.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
