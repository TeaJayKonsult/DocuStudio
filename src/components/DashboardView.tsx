import React, { useState } from 'react';
import { 
  FileText, 
  PenTool, 
  FileEdit, 
  FileSpreadsheet, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Shield, 
  CreditCard,
  Settings,
  ChevronRight
} from 'lucide-react';
import { UserProfile, HistoryItem, ToolType, ActivePage } from '../types';

interface DashboardViewProps {
  currentUser: UserProfile;
  history: HistoryItem[];
  onOpenTool: (tool: ToolType) => void;
  onOpenSettings: () => void;
  setActivePage: (page: ActivePage) => void;
  onTriggerUpgrade: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  history,
  onOpenTool,
  onOpenSettings,
  setActivePage,
  onTriggerUpgrade
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const isPro = currentUser.plan === 'pro';

  const tools = [
    {
      id: 'pdf-viewer' as ToolType,
      title: 'PDF Viewer',
      badge: 'Upload & view PDFs',
      icon: '✏️',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      id: 'text-editor' as ToolType,
      title: 'Text Editor',
      badge: 'Create & format documents',
      icon: '📄',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      id: 'pdf-editor-tools' as ToolType,
      title: 'PDF Editor & Tools',
      badge: 'Edit, fill forms, draw signatures',
      icon: '📝',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      id: 'document-viewers' as ToolType,
      title: 'Document Viewers',
      badge: 'Excel, PPT, E-book, DOCX',
      icon: '📊',
      color: 'bg-teal-50 text-teal-600'
    }
  ];

  const filteredHistory = history.filter((item) =>
    item.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A2E] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-serif font-bold text-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome, {currentUser.displayName || 'DocuStudio User'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">{currentUser.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </button>

            {!isPro && (
              <button
                onClick={onTriggerUpgrade}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade to Pro</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Membership Plan
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-gray-900 capitalize">
                {currentUser.plan} Plan
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                isPro ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {isPro ? 'Unlimited' : 'Standard'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {isPro ? 'Active unlimited document workflows' : '5 free operations refreshed monthly'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Actions Remaining
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-indigo-600">
                {isPro ? '∞' : currentUser.actionsRemaining}
              </span>
              <span className="text-xs text-gray-400">
                {isPro ? 'No limits' : 'Monthly quota'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {isPro ? 'Never run out of signatures or edits' : `${currentUser.actionsRemaining} actions remaining this cycle`}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Total Activity Logs
            </span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-gray-900">
                {history.length}
              </span>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Auditable records stored safely in your workspace
            </p>
          </div>
        </div>

        {/* Upgrade Banner for Free Users */}
        {!isPro && (
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-1 z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Special Pro Rate</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold">
                Unlock Unlimited Actions for ₦700 / month
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
                Get unlimited PDF fill &amp; sign operations, high-res downloads, spreadsheet parsers, and priority server processing.
              </p>
            </div>
            <button
              onClick={onTriggerUpgrade}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-indigo-950 font-bold text-sm rounded-xl shadow-lg cursor-pointer transition-all hover:scale-102 shrink-0 z-10"
            >
              Upgrade Now with Paystack →
            </button>
          </div>
        )}

        {/* Document Tools Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-gray-900">Document Tools</h2>
            <button
              onClick={() => setActivePage('tools')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              View details →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((t) => (
              <div
                key={t.id}
                onClick={() => onOpenTool(t.id)}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="text-3xl mb-3">{t.icon}</div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{t.badge}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                  <span>Open workspace</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-gray-900">Recent Activity</h2>
              <p className="text-xs text-gray-500 mt-0.5">Your recent document operations and exports</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activity..."
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredHistory.length === 0 ? (
              <div className="p-12 text-center text-gray-400 text-xs">
                No recent activity recorded. Launch any tool above to get started!
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
                    <th className="py-3 px-6">Action</th>
                    <th className="py-3 px-6">Document Name</th>
                    <th className="py-3 px-6">Size / Type</th>
                    <th className="py-3 px-6">Date &amp; Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-6 font-semibold text-indigo-600 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item.action}</span>
                      </td>
                      <td className="py-3.5 px-6 text-gray-800 font-medium">{item.documentName}</td>
                      <td className="py-3.5 px-6 text-gray-500">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-[11px] font-mono">
                          {item.fileSize || 'Standard'}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-gray-400">
                        {new Date(item.timestamp).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
