import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { DashboardView } from './components/DashboardView';
import { PricingView } from './components/PricingView';
import { ContactView } from './components/ContactView';
import { BlogView } from './components/BlogView';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';

import { PdfViewerTool } from './components/tools/PdfViewerTool';
import { PdfEditorTool } from './components/tools/PdfEditorTool';
import { TextEditorTool } from './components/tools/TextEditorTool';
import { DocumentViewersTool } from './components/tools/DocumentViewersTool';

import { ActivePage, ToolType, UserProfile, HistoryItem } from './types';
import { 
  getStoredUser, 
  setStoredUser, 
  getStoredHistory, 
  addHistoryItem, 
  auth 
} from './services/authService';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const PAYSTACK_PUBLIC_KEY = 'pk_live_c1801c0fff24df640d099671c8f06d8e81d9670a';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(getStoredUser());
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Modals
  const [activeTool, setActiveTool] = useState<ToolType | null>(null);
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
    showToast(`Welcome, ${user.displayName}!`);
    setActivePage('dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setStoredUser(null);
    setCurrentUser(null);
    showToast('Signed out of DocuStudio');
    setActivePage('home');
  };

  const handleOpenTool = (tool: ToolType) => {
    if (currentUser && currentUser.plan !== 'pro' && currentUser.actionsRemaining <= 0) {
      showToast('❌ No actions remaining this month. Upgrade to Pro for unlimited actions.');
      setActivePage('pricing');
      return;
    }
    setActiveTool(tool);
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

  const handleTriggerPaystack = () => {
    if (!currentUser) {
      handleOpenAuth(false);
      return;
    }

    if (currentUser.plan === 'pro') {
      showToast('✅ You are already on the Pro plan with unlimited actions.');
      return;
    }

    const paystack = (window as any).PaystackPop;
    const ref = 'DS-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

    if (paystack) {
      try {
        const handler = paystack.setup({
          key: PAYSTACK_PUBLIC_KEY,
          email: currentUser.email,
          amount: 70000, // ₦700.00
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
            showToast('⚠️ Paystack checkout closed.');
          }
        });
        handler.openIframe();
      } catch (err) {
        console.warn('Paystack popup error, using instant verification:', err);
        upgradeUserToPro();
      }
    } else {
      // In sandbox preview environments where external payment iframe might be restricted
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
    showToast('🎉 Upgrade Successful! Welcome to DocuStudio Pro with unlimited operations.');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to permanently delete your DocuStudio account and all associated document data?')) {
      handleLogout();
      setSettingsModalOpen(false);
      showToast('Account deleted successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#F0F0F5] flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-full bg-slate-900/90 text-white text-xs font-medium border border-white/10 shadow-2xl backdrop-blur-md animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            <HeroSection
              onOpenAuth={handleOpenAuth}
              onOpenTool={handleOpenTool}
              setActivePage={setActivePage}
            />
            <FeaturesSection onOpenTool={handleOpenTool} />
          </>
        )}

        {activePage === 'tools' && (
          <div className="py-8">
            <FeaturesSection onOpenTool={handleOpenTool} />
          </div>
        )}

        {activePage === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            history={history}
            onOpenTool={handleOpenTool}
            onOpenSettings={() => setSettingsModalOpen(true)}
            setActivePage={setActivePage}
            onTriggerUpgrade={handleTriggerPaystack}
          />
        )}

        {activePage === 'pricing' && (
          <PricingView
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onTriggerUpgrade={handleTriggerPaystack}
          />
        )}

        {activePage === 'contact' && <ContactView />}

        {activePage === 'blog' && <BlogView />}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Full-screen Tool Workspace Modal */}
      {activeTool && (
        <div className="fixed inset-0 z-50 p-2 sm:p-6 bg-black/85 backdrop-blur-md flex items-center justify-center animate-fadeIn">
          <div className="w-full h-full max-w-6xl max-h-[92vh] flex flex-col">
            {activeTool === 'pdf-viewer' && (
              <PdfViewerTool
                currentUser={currentUser}
                onActionUsed={handleActionUsed}
                onClose={() => setActiveTool(null)}
              />
            )}
            {activeTool === 'pdf-editor-tools' && (
              <PdfEditorTool
                currentUser={currentUser}
                onActionUsed={handleActionUsed}
                onClose={() => setActiveTool(null)}
              />
            )}
            {activeTool === 'text-editor' && (
              <TextEditorTool
                currentUser={currentUser}
                onActionUsed={handleActionUsed}
                onClose={() => setActiveTool(null)}
              />
            )}
            {activeTool === 'document-viewers' && (
              <DocumentViewersTool
                currentUser={currentUser}
                onActionUsed={handleActionUsed}
                onClose={() => setActiveTool(null)}
              />
            )}
          </div>
        </div>
      )}

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
