'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Document } from '@/types';
import { toast } from 'sonner';
import React from 'react';
import axios from 'axios';

export default function Page() {
  const params = useParams();
  const documentId = params.id;

  const [document, setDocument] = React.useState<Document | null>(null);
  const [error, setError] = React.useState('');

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
    <div className="relative isolate mx-auto max-w-3xl px-8 pt-14 lg:px-10">
      <h1 className="text-3xl font-semibold tracking-tight text-balance">{document.title}</h1>
      <div className="prose prose-neutral dark:prose-invert mt-2">
        <Markdown remarkPlugins={[remarkGfm]}>{document.content}</Markdown>
      </div>
    </div>
  );
}
