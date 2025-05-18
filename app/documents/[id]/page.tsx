'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorCanvas } from '@/components/editor-canvas';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Document } from '@/types';
import { toast } from 'sonner';
import React from 'react';
import axios from 'axios';

export default function Page() {
  const params = useParams();
  const documentId = params.id as string;

  const [document, setDocument] = React.useState<Document | null>(null);
  const [error, setError] = React.useState('');

  const [tab, setTab] = React.useState<'view' | 'edit'>('view');

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

  return (
    <div className="relative isolate mx-auto max-w-4xl px-8 pt-14 lg:px-10">
      <Badge variant="secondary">Content is up to date</Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance">{document.title}</h1>
      <Tabs
        defaultValue="view"
        value={tab}
        onValueChange={(v) => setTab(v as 'view' | 'edit')}
        className="w-full pt-12"
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
          <div className="prose prose-neutral dark:prose-invert pt-8">
            <Markdown remarkPlugins={[remarkGfm]}>{document.content}</Markdown>
          </div>
        </TabsContent>
        <TabsContent value="edit">
          <div className="pt-8">
            <EditorCanvas initialContent={document.content ?? undefined} documentId={documentId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
