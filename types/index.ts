export interface User {
  id: string;
  displayName: string;
  email: string;
  emailConfirmed: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  title: string;
  content: string | null;
  isArchived: boolean;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SidebarDocument {
  id: string;
  title: string;
}
