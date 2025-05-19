'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sidebarDocumentsAtom } from '@/store/sidebarDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { toast } from 'sonner';
import React from 'react';
import axios from 'axios';

export default function NewDocumentPage() {
  const [title, setTitle] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const setSidebarDocuments = useSetAtom(sidebarDocumentsAtom);

  const onCreate = async () => {
    setIsSubmitting(true);
    if (!title.length) {
      toast('Document title can not be empty', {
        description: 'Please enter a valid title before proceeding.',
      });
    }

    try {
      const response = await axios.post('/api/documents', { title });
      const { id } = response.data;

      if (!id) {
        toast('Document creation failed', {
          description: `Error: ${response.data.message}`,
        });
      }

      setSidebarDocuments((docs) => (docs ? [{ id, title }, ...docs] : []));
      router.replace(`/documents/${id}`);
    } catch (error) {
      console.error('Error in creating document', error);
      toast('An error has occurred', {
        description: 'We could not process the request. Please try after some time.',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog
      open
      onOpenChange={(state) => {
        if (!state) router.back();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new document</DialogTitle>
          <DialogDescription>
            Give it a meaningful title. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              placeholder="Enter a title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" disabled={isSubmitting} onClick={onCreate}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
