import { atom } from 'jotai';

export type DocumentSaveStatus = 'initial' | 'inProgress' | 'success' | 'failed';

export interface DocumentType {
  title: string;
  content?: string;
  saveStatus: DocumentSaveStatus;
  lastSavedContent?: string;
  lastUpdatedAt?: Date;
}

const initialDocumentState: DocumentType = {
  title: '',
  content: undefined,
  saveStatus: 'initial',
  lastSavedContent: undefined,
  lastUpdatedAt: undefined,
};

export const documentAtom = atom<DocumentType>(initialDocumentState);

export const titleAtom = atom(
  (get) => get(documentAtom).title,
  (get, set, newTitle: string) => set(documentAtom, (prev) => ({ ...prev, title: newTitle })),
);

export const contentAtom = atom(
  (get) => get(documentAtom).content,
  (get, set, newContent?: string) =>
    set(documentAtom, (prev) => ({ ...prev, content: newContent })),
);

export const saveStatusAtom = atom(
  (get) => get(documentAtom).saveStatus,
  (get, set, newSaveStatus: DocumentSaveStatus) =>
    set(documentAtom, (prev) => ({ ...prev, saveStatus: newSaveStatus })),
);

export const lastSavedContentAtom = atom(
  (get) => get(documentAtom).lastSavedContent,
  (get, set, newLastSavedDocument?: string) =>
    set(documentAtom, (prev) => ({ ...prev, lastSavedContent: newLastSavedDocument })),
);

export const lastUpdatedAtAtom = atom(
  (get) => get(documentAtom).lastUpdatedAt,
  (get, set, newLastUpdatedAt?: Date) =>
    set(documentAtom, (prev) => ({ ...prev, lastUpdatedAt: newLastUpdatedAt })),
);
