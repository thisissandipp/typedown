import { atom } from 'jotai';

export interface SidebarDocument {
  id: string;
  title: string;
  isFavorite: boolean;
  updatedAt: Date;
}

export const sidebarDocumentsAtom = atom<SidebarDocument[] | undefined>(undefined);
export const sidebarDocumentsCountAtom = atom((get) => (get(sidebarDocumentsAtom) ?? []).length);

export const workspaceDocumentsAtom = atom((get) =>
  get(sidebarDocumentsAtom)?.filter((doc) => !doc.isFavorite),
);

export const favoritesDocumentsAtom = atom((get) =>
  get(sidebarDocumentsAtom)?.filter((doc) => doc.isFavorite),
);
