import {
  contentAtom,
  lastSavedContentAtom,
  lastUpdatedAtAtom,
  saveStatusAtom,
} from '@/store/document';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { useAtom, useSetAtom } from 'jotai';
import axios from 'axios';
import React from 'react';

interface EditorCanvasProps {
  documentId: string;
}

export function EditorCanvas({ documentId }: EditorCanvasProps) {
  const [content, setContent] = useAtom(contentAtom);
  const [, setSaveStatus] = useAtom(saveStatusAtom);
  const [lastSavedContent, setLastSavedContent] = useAtom(lastSavedContentAtom);

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);

  const saveToLocalStorage = React.useCallback(
    (...args: unknown[]) => {
      const currentContent = args[0] as string;
      localStorage.setItem(
        `draft-document-${documentId}`,
        JSON.stringify({ content: currentContent, timestamp: Date.now() }),
      );
    },
    [documentId],
  );

  const [debouncedSaveToLocalStorage] = useDebounce(saveToLocalStorage, 500);

  const saveToServer = React.useCallback(
    async (...args: unknown[]) => {
      const currentContent = args[0] as string;
      if (lastSavedContent === currentContent) return;

      setSaveStatus('inProgress');
      try {
        const response = await axios.patch(`/api/documents/${documentId}`, {
          content: currentContent,
        });
        if (response.status === 200) {
          setLastSavedContent(currentContent);
          setSaveStatus('success');
          setLastUpdatedAt(new Date());
        } else {
          console.error('Failed to update document', response.data?.message || response.statusText);
          setSaveStatus('failed');
        }
      } catch (error) {
        console.error('Error saving document:', error);
      } finally {
        setTimeout(() => setSaveStatus('initial'), 2000);
      }
    },
    [documentId, lastSavedContent, setLastSavedContent, setLastUpdatedAt, setSaveStatus],
  );

  const [debouncedSaveToServer] = useDebounce(saveToServer, 1000);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSaveToLocalStorage(newContent);
    debouncedSaveToServer(newContent);
  };

  return (
    <Textarea
      className="mb-12"
      value={content ?? ''}
      placeholder="Start writing your document or thoughts..."
      onChange={handleContentChange}
    />
  );
}
