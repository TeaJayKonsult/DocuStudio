export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  plan: 'free' | 'pro';
  actionsRemaining: number;
  lastReset?: string;
  createdAt?: string;
}

export interface HistoryItem {
  id: string;
  userId: string;
  action: string;
  documentName: string;
  timestamp: string;
  fileSize?: string;
  fileType?: string;
}

export type ToolType = 'pdf-viewer' | 'pdf-editor-tools' | 'text-editor' | 'document-viewers';

export type ActivePage = 'home' | 'dashboard' | 'tools' | 'pricing' | 'contact' | 'blog';

export interface PDFAnnotation {
  id: string;
  page: number;
  type: 'text' | 'checkbox' | 'signature';
  x: number;
  y: number;
  text?: string;
  size?: number;
  color?: string;
  imageData?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  snippet: string;
  content: string[];
}
