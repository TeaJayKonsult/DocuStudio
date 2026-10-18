import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { UserProfile, HistoryItem } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyDdboIxnsvdJNVNN5GnRshWu7gctzBw6b0",
  authDomain: "docustudio-1e91f.firebaseapp.com",
  projectId: "docustudio-1e91f",
  storageBucket: "docustudio-1e91f.firebasestorage.app",
  messagingSenderId: "699941699006",
  appId: "1:699941699006:web:863c41f668266de2284def",
  measurementId: "G-9CZ0RXMJCQ"
};

// Initialize Firebase safely
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const STORAGE_KEY_USER = 'docustudio_user_session';
const STORAGE_KEY_HISTORY = 'docustudio_user_history';

export const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: UserProfile | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_USER);
  }
};

export const getStoredHistory = (uid: string): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_HISTORY}_${uid}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: 'demo-1',
      userId: uid,
      action: 'PDF View & Sign',
      documentName: 'Consultancy_Agreement.pdf',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      fileSize: '412 KB',
      fileType: 'PDF'
    },
    {
      id: 'demo-2',
      userId: uid,
      action: 'Text Document Created',
      documentName: 'Quarterly_Strategy_Report.txt',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      fileSize: '84 KB',
      fileType: 'DOC'
    }
  ];
};

export const addHistoryItem = (uid: string, action: string, documentName: string, fileSize?: string, fileType?: string): HistoryItem => {
  const current = getStoredHistory(uid);
  const newItem: HistoryItem = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: uid,
    action,
    documentName,
    timestamp: new Date().toISOString(),
    fileSize: fileSize || '120 KB',
    fileType: fileType || 'Document'
  };
  const updated = [newItem, ...current];
  try {
    localStorage.setItem(`${STORAGE_KEY_HISTORY}_${uid}`, JSON.stringify(updated));
  } catch {}
  return newItem;
};

export const clearStoredHistory = (uid: string) => {
  localStorage.removeItem(`${STORAGE_KEY_HISTORY}_${uid}`);
};
