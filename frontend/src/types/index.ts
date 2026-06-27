export type UserRole = 'reader' | 'author' | 'editor' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  institution: string | null;
  orcid: string | null;
}

export interface Journal {
  id: string;
  title: string;
  description: string | null;
  issn: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Volume {
  id: string;
  journalId: string;
  volumeNumber: string;
  year: string;
}

export interface Issue {
  id: string;
  volumeId: string;
  issueNumber: string;
  title: string | null;
  year: string;
}

export interface Article {
  id: string;
  issueId: string;
  title: string;
  abstract: string;
  pdfUrl: string | null;
  doi: string | null;
  publishedAt: string;
  views: number;
  downloads: number;
  authors?: {
    authorOrder: number;
    details: Author;
  }[];
  journalTitle?: string;
  journalId?: string;
  volumeNumber?: string;
  issueNumber?: string;
}

export interface ReadingList {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  createdAt: string;
  article: Article;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Keyword {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

