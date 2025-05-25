'use client';

import { contentAtom, documentAtom, lastSavedContentAtom, titleAtom } from '@/store/document';
import { type SidebarDocument, sidebarDocumentsAtom } from '@/store/sidebarDocuments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditableTitle } from '@/components/editable-title';
import { EditorCanvas } from '@/components/editor-canvas';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { Skeleton } from '@/components/ui/skeleton';
// import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';
// import { Clock8 } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import { Document } from '@/types';
import { toast } from 'sonner';
import React from 'react';
import axios from 'axios';

export default function DocumentIdPage() {
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = React.useState<Document | null>(null);
  const [error, setError] = React.useState('');
  const [tab, setTab] = React.useState<'view' | 'edit'>('view');

  const {
    title,
    content: currentContent,
    saveStatus,
    lastSavedContent,
  } = useAtomValue(documentAtom);

  const setTitle = useSetAtom(titleAtom);
  const setCurrentContent = useSetAtom(contentAtom);
  const setLastSavedContent = useSetAtom(lastSavedContentAtom);

  const [sidebarDocuments, setSidebarDocuments] = useAtom(sidebarDocumentsAtom);

  const handleTitleChange = async (newTitle: string) => {
    if (!sidebarDocuments) return;

    const previousValue = sidebarDocuments;
    const previousTitle = title;

    const [item] = sidebarDocuments.filter((document) => document.id === documentId);
    const documentsWithoutItem = sidebarDocuments.filter((document) => document.id !== documentId);
    const updatedItem: SidebarDocument = { ...item, title: newTitle };

    setTitle(newTitle);
    setSidebarDocuments([updatedItem, ...documentsWithoutItem]);

    try {
      const response = await axios.patch(`/api/documents/${item.id}`, {
        title: newTitle,
      });
      if (response.status !== 200) {
        setSidebarDocuments(previousValue);
        setTitle(previousTitle);
        console.error(
          'Failed to update document title',
          response.data?.message || response.statusText,
        );
        toast('Failed to update document title', {
          description: response.data?.message || response.statusText,
        });
      } else {
        toast('Title updated', { description: 'The title of this document has been saved.' });
      }
    } catch (error) {
      setSidebarDocuments(previousValue);
      setTitle(previousTitle);
      console.error('Error updating title', error);
      toast('Something went wrong', {
        description: 'Internal server error while updating the document title',
      });
    }
  };

  React.useEffect(() => {
    const getDocument = async () => {
      try {
        const response = await axios.get(`/api/documents/${documentId}`);

        if (response.status === 401 || response.status === 404) {
          setError(response.data.message);
          return;
        }
        setDocument(response.data.document);
      } catch (error) {
        console.error('Failed to load document', error);
        setError('Failed to load document');
      }
    };

    getDocument();
  }, [documentId]);

  React.useEffect(() => {
    setTitle(document?.title ?? '');
    setCurrentContent(document?.content ?? undefined);
    setLastSavedContent(document?.content ?? undefined);
  }, [document?.title, document?.content, setTitle, setCurrentContent, setLastSavedContent]);

  if (error.length !== 0) {
    toast('An error has occurred', { description: error });
  }

  if (error && !document) {
    return <div>Sorry, couldn&apos;t load the document.</div>;
  }

  if (!document) {
    return (
      <div className="relative isolate mx-auto max-w-3xl px-8 pt-14 lg:px-10">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`mt-4 h-4 w-full animate-pulse ${
              i === 3 ? 'w-[75%]' : i === 6 ? 'w-[60%]' : 'w-full'
            } ${i === 4 ? 'mt-12' : ''}`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    );
  }

  console.log(`#Page: it came here`, document);
  console.log(`#Page: it came here with title`, title);

  return (
    <div className="relative isolate mx-auto max-w-3xl px-8 pt-14 lg:px-10">
      {saveStatus === 'inProgress' && <Badge variant="secondary">Syncing with server...</Badge>}
      {saveStatus === 'success' && <Badge variant="secondary">Content is up to date</Badge>}
      {saveStatus === 'failed' && (
        <Badge variant="destructive" className="text-[#F43F5E]">
          Sync failed
        </Badge>
      )}
      {saveStatus === 'initial' && currentContent !== lastSavedContent && (
        <Badge variant="default">Unsaved changes</Badge>
      )}
      {saveStatus === 'initial' && currentContent === lastSavedContent && (
        <Badge variant="secondary">Content is up to date</Badge>
      )}
      {/* <Badge variant="outline" className="ml-2.5">
        <Clock8 />
        Updated on Sun, 25 May
      </Badge> */}

      <EditableTitle title={title} onTitleChange={handleTitleChange} />

      <Tabs
        defaultValue="view"
        value={tab}
        onValueChange={(v) => setTab(v as 'view' | 'edit')}
        className="pt-12"
      >
        <TabsList className="grid w-[275px] grid-cols-2">
          <TabsTrigger
            value="view"
            className="data-[state=active]:bg-background dark:data-[state=active]:bg-background text-xs"
          >
            {tab === 'view' && <span className="mr-1 h-2 w-2 rounded-full bg-green-500" />}
            <span className="font-semibold tracking-tight">Document View</span>
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-background dark:data-[state=active]:bg-background text-xs"
          >
            {tab === 'edit' && <span className="mr-1 h-2 w-2 rounded-full bg-amber-500" />}
            <span className="font-semibold tracking-tight">Edit Content</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <div className="prose prose-neutral dark:prose-invert mb-12 max-w-none pt-8">
            <Markdown remarkPlugins={[remarkGfm]}>{lastSavedContent ?? document.content}</Markdown>
          </div>
        </TabsContent>
        <TabsContent value="edit">
          <div className="pt-8">
            <EditorCanvas documentId={documentId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
