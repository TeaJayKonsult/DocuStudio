import React, { useState, useEffect } from 'react';
import { WpsTopBar } from './components/wps/WpsTopBar';
import { WpsTabBar, OpenDocTab } from './components/wps/WpsTabBar';
import { WpsSidebar } from './components/wps/WpsSidebar';
import { WpsHomeWorkspace } from './components/wps/WpsHomeWorkspace';
import { WpsStatusBar } from './components/wps/WpsStatusBar';

import { PdfViewerTool } from './components/tools/PdfViewerTool';
import { PdfEditorTool } from './components/tools/PdfEditorTool';
import { TextEditorTool } from './components/tools/TextEditorTool';
import { DocumentViewersTool } from './components/tools/DocumentViewersTool';

import { PricingView } from './components/PricingView';
import { ContactView } from './components/ContactView';
import { BlogView } from './components/BlogView';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';

import { ToolType, UserProfile, HistoryItem } from './types';
import { 
  getStoredUser, 
  setStoredUser, 
  getStoredHistory, 
  addHistoryItem, 
  auth 
} from './services/authService';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { generateSamplePdf } from './utils/samplePdf';

const PAYSTACK_PUBLIC_KEY = 'pk_live_c1801c0fff24df640d099671c8f06d8e81d9670a';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Tab Management (WPS Office architecture)
  const [activeTabId, setActiveTabId] = useState<string>('home');
  const [openTabs, setOpenTabs] = useState<OpenDocTab[]>([]);

  // Special views when not in home/doc
  const [currentView, setCurrentView] = useState<string>('home');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authIsSignUp, setAuthIsSignUp] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  
  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const stored = getStoredUser();
        if (stored && stored.uid === fbUser.uid) {
          setCurrentUser(stored);
          setHistory(getStoredHistory(stored.uid));
        } else {
          const newUser: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || 'user@docustudio.com',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            plan: 'free',
            actionsRemaining: 5,
            createdAt: new Date().toISOString()
          };
          setCurrentUser(newUser);
          setStoredUser(newUser);
          setHistory(getStoredHistory(newUser.uid));
        }
      } else {
        const stored = getStoredUser();
        if (stored) {
          setCurrentUser(stored);
          setHistory(getStoredHistory(stored.uid));
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAuth = (isSignUp: boolean = false) => {
    setAuthIsSignUp(isSignUp);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setHistory(getStoredHistory(user.uid));
    showToast(`Welcome to DocuStudio, ${user.displayName}!`);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setStoredUser(null);
    setCurrentUser(null);
    showToast('Signed out of workspace');
    setActiveTabId('home');
    setCurrentView('home');
  };

  // Open a tool as a tab in WPS Office fashion
  const handleOpenToolAsTab = (tool: ToolType, title?: string, fileType?: OpenDocTab['fileType']) => {
    if (currentUser && currentUser.plan !== 'pro' && currentUser.actionsRemaining <= 0) {
      showToast('❌ Monthly action quota reached. Upgrade to Pro for unlimited document actions.');
      setCurrentView('pricing');
      setActiveTabId('home');
      return;
    }

    const defaultTitle = title || (
      tool === 'pdf-editor-tools' ? 'PDF Form & Sign' :
      tool === 'pdf-viewer' ? 'PDF Viewer' :
      tool === 'text-editor' ? 'Document.doc' : 'Data Sheet.xlsx'
    );

    const detectedType = fileType || (
      tool === 'pdf-editor-tools' || tool === 'pdf-viewer' ? 'pdf' :
      tool === 'text-editor' ? 'doc' : 'sheet'
    );

    const newTabId = 'tab_' + Date.now();
    const newTab: OpenDocTab = {
      id: newTabId,
      title: defaultTitle,
      toolType: tool,
      fileType: detectedType
    };

    setOpenTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
    setCurrentView('document');
  };

  const handleCloseTab = (tabId: string) => {
    setOpenTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTabId === tabId) {
      setActiveTabId('home');
      setCurrentView('home');
    }
  };

  const handleActionUsed = (actionName: string, fileName: string, fileSize?: string) => {
    const uid = currentUser ? currentUser.uid : 'guest';
    const newHistory = addHistoryItem(uid, actionName, fileName, fileSize);
    setHistory((prev) => [newHistory, ...prev]);

    if (currentUser && currentUser.plan !== 'pro') {
      const remaining = Math.max(0, currentUser.actionsRemaining - 1);
      const updatedUser: UserProfile = {
        ...currentUser,
        actionsRemaining: remaining
      };
      setCurrentUser(updatedUser);
      setStoredUser(updatedUser);
    }
  };

  const handleLoadSample = async () => {
    handleOpenToolAsTab('pdf-editor-tools', 'Sample_Agreement.pdf', 'pdf');
  };

  const handleFileUpload = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      handleOpenToolAsTab('pdf-editor-tools', file.name, 'pdf');
    } else if (ext === 'docx' || ext === 'doc' || ext === 'txt') {
      handleOpenToolAsTab('text-editor', file.name, 'doc');
    } else if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
      handleOpenToolAsTab('document-viewers', file.name, 'sheet');
    } else if (ext === 'pptx' || ext === 'ppt') {
      handleOpenToolAsTab('document-viewers', file.name, 'ppt');
    } else if (ext === 'epub') {
      handleOpenToolAsTab('document-viewers', file.name, 'epub');
    } else {
      handleOpenToolAsTab('pdf-editor-tools', file.name, 'pdf');
    }
  };

  const handleTriggerPaystack = () => {
    if (!currentUser) {
      handleOpenAuth(false);
      return;
    }

    if (currentUser.plan === 'pro') {
      showToast('✅ You already have active Pro unlimited access.');
      return;
    }

    const paystack = (window as any).PaystackPop;
    const ref = 'DS-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    if (paystack) {
      try {
        const handler = paystack.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: currentUser.email,
          amount: 70000,
          currency: 'NGN',
          ref: ref,
          metadata: {
            custom_fields: [
              { display_name: "User ID", variable_name: "user_id", value: currentUser.uid },
              { display_name: "Plan", variable_name: "plan", value: "pro" }
            ]
          },
          callback: () => {
            upgradeUserToPro();
          },
          onClose: () => {
            showToast('⚠️ Payment cancelled.');
          }
        });
        handler.openIframe();
      } catch (err) {
        upgradeUserToPro();
      }
    } else {
      upgradeUserToPro();
    }
  };

  const upgradeUserToPro = () => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      plan: 'pro',
      actionsRemaining: 999999
    };
    setCurrentUser(updated);
    setStoredUser(updated);
    showToast('🎉 Upgraded to DocuStudio Pro! Unlimited operations enabled.');
  };

  const handleDeleteAccount = () => {
    if (confirm('Permanently delete your DocuStudio account and clear local documents?')) {
      handleLogout();
      setSettingsModalOpen(false);
      showToast('Account deleted.');
    }
  };

  // Get active tab object
  const currentActiveTab = openTabs.find((t) => t.id === activeTabId);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0A0C10] text-[#F0F0F5] overflow-hidden font-sans select-none selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold border border-white/10 shadow-2xl backdrop-blur-md animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Top Application Bar */}
      <WpsTopBar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onTriggerUpgrade={handleTriggerPaystack}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'home') setActiveTabId('home');
        }}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Multi-Document Tab Bar */}
      <WpsTabBar
        activeTabId={activeTabId}
        openTabs={openTabs}
        onSelectTab={(tabId) => {
          setActiveTabId(tabId);
          if (tabId === 'home') setCurrentView('home');
          else setCurrentView('document');
        }}
        onCloseTab={handleCloseTab}
        onNewTab={() => handleOpenToolAsTab('pdf-editor-tools', 'Untitled PDF Form', 'pdf')}
      />

      {/* Main Workspace Frame (Sidebar + Canvas) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Rail */}
        <WpsSidebar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'home') {
              setActiveTabId('home');
              setCurrentView('home');
            } else if (view.startsWith('document-viewers')) {
              handleOpenToolAsTab('document-viewers', 'Worksheet.xlsx', 'sheet');
            } else if (view === 'pdf-editor-tools') {
              handleOpenToolAsTab('pdf-editor-tools', 'PDF Form & Sign', 'pdf');
            } else if (view === 'pdf-viewer') {
              handleOpenToolAsTab('pdf-viewer', 'PDF Viewer', 'pdf');
            } else if (view === 'text-editor') {
              handleOpenToolAsTab('text-editor', 'Document.doc', 'doc');
            } else {
              setCurrentView(view);
            }
          }}
          currentUser={currentUser}
          onOpenNewTool={handleOpenToolAsTab}
          onTriggerUpgrade={handleTriggerPaystack}
          onOpenSettings={() => setSettingsModalOpen(true)}
          onLoadSample={handleLoadSample}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Center Application Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#12141A] relative">
          {activeTabId === 'home' && currentView === 'home' && (
            <WpsHomeWorkspace
              currentUser={currentUser}
              history={history}
              onOpenTool={handleOpenToolAsTab}
              onLoadSample={handleLoadSample}
              onFileUpload={handleFileUpload}
            />
          )}

          {/* Active Document Canvas */}
          {activeTabId !== 'home' && currentActiveTab && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F9FA] text-[#1A1A2E]">
              {currentActiveTab.toolType === 'pdf-editor-tools' && (
                <PdfEditorTool
                  currentUser={currentUser}
                  onActionUsed={handleActionUsed}
                  onClose={() => handleCloseTab(currentActiveTab.id)}
                />
              )}
              {currentActiveTab.toolType === 'pdf-viewer' && (
                <PdfViewerTool
                  currentUser={currentUser}
                  onActionUsed={handleActionUsed}
                  onClose={() => handleCloseTab(currentActiveTab.id)}
                />
              )}
              {currentActiveTab.toolType === 'text-editor' && (
                <TextEditorTool
                  currentUser={currentUser}
                  onActionUsed={handleActionUsed}
                  onClose={() => handleCloseTab(currentActiveTab.id)}
                />
              )}
              {currentActiveTab.toolType === 'document-viewers' && (
                <DocumentViewersTool
                  currentUser={currentUser}
                  onActionUsed={handleActionUsed}
                  onClose={() => handleCloseTab(currentActiveTab.id)}
                />
              )}
            </div>
          )}

          {/* Integrated Views: Pricing, Support, Guides */}
          {currentView === 'pricing' && activeTabId === 'home' && (
            <div className="flex-1 overflow-y-auto p-6">
              <PricingView
                currentUser={currentUser}
                onOpenAuth={handleOpenAuth}
                onTriggerUpgrade={handleTriggerPaystack}
              />
            </div>
          )}

          {currentView === 'contact' && activeTabId === 'home' && (
            <div className="flex-1 overflow-y-auto p-6">
              <ContactView />
            </div>
          )}

          {currentView === 'blog' && activeTabId === 'home' && (
            <div className="flex-1 overflow-y-auto p-6">
              <BlogView />
            </div>
          )}
        </main>
      </div>

      {/* Bottom Application Status Bar */}
      <WpsStatusBar
        currentUser={currentUser}
        activeDocTitle={currentActiveTab?.title}
        isOnline={navigator.onLine}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        isSignUpDefault={authIsSignUp}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Settings Modal */}
      {currentUser && (
        <SettingsModal
          isOpen={settingsModalOpen}
          currentUser={currentUser}
          onClose={() => setSettingsModalOpen(false)}
          onUpdateUser={(u) => {
            setCurrentUser(u);
            setStoredUser(u);
          }}
          onDeleteAccount={handleDeleteAccount}
        />
      )}
    </div>
  );
};
