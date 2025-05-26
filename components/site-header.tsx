import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type SidebarDocument, sidebarDocumentsAtom } from '@/store/sidebarDocuments';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { redirect, useParams } from 'next/navigation';
import { lastUpdatedAtAtom } from '@/store/document';
import { Loader2, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAtom, useSetAtom } from 'jotai';
import { toast } from 'sonner';
import axios from 'axios';
import React from 'react';

export function SiteHeader() {
  const params = useParams();
  const documentId = params?.id;

  const [trashDialogOpen, setTrashDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [sidebarDocuments, setSidebarDocuments] = useAtom(sidebarDocumentsAtom);

  const setLastUpdatedAt = useSetAtom(lastUpdatedAtAtom);

  const activeDoc = sidebarDocuments?.find((doc) => doc.id === documentId);

  const updateFavoriteStatus = async (item: SidebarDocument) => {
    if (!sidebarDocuments) return;

    const previousValue = sidebarDocuments;
    const documentsWithoutItem = sidebarDocuments.filter((document) => document.id !== item.id);
    const updatedItem: SidebarDocument = { ...item, isFavorite: !item.isFavorite };

    setSidebarDocuments([updatedItem, ...documentsWithoutItem]);

    try {
      const successMessage = item.isFavorite ? 'Removed from Favorites' : 'Added to Favorites';
      const successDescription = (
        <p>
          The document: <strong>{item.title}</strong> is now{' '}
          {item.isFavorite ? 'removed from' : 'added to'} Favorites.
        </p>
      );
      const response = await axios.patch(`/api/documents/${item.id}`, {
        isFavorite: !item.isFavorite,
      });
      if (response.status !== 200) {
        setSidebarDocuments(previousValue);
        console.error(
          'Failed to update favorite status',
          response.data?.message || response.statusText,
        );
        toast('Failed to update Favorite status', {
          description: response.data?.message || response.statusText,
        });
      } else {
        toast(successMessage, { description: successDescription });
        setLastUpdatedAt(new Date());
      }
    } catch (error) {
      setSidebarDocuments(previousValue);
      console.error('Error updating favorite', error);
      toast('Something went wrong', {
        description: 'Internal server error while updating the favorite status',
      });
    }
  };

  const handleDelete = async (item: SidebarDocument) => {
    setIsDeleting(true);
    let toBeRedirected = false;
    try {
      const response = await axios.delete(`/api/documents/${item.id}`);
      if (response.status !== 204) {
        console.error(
          'Failed to delete the document',
          response.data?.message || response.statusText,
        );
        toast('Failed to delete', {
          description: response.data?.message || response.statusText,
        });
      } else {
        const documentsWithoutItem = sidebarDocuments?.filter(
          (document) => document.id !== item.id,
        );
        if (documentsWithoutItem) setSidebarDocuments(documentsWithoutItem);
        toBeRedirected = true;
      }
    } catch (error) {
      console.error('Error deleting document', error);
      toast("Couldn't delete document", {
        description: 'There was a problem deleting the document. Please try again.',
      });
    } finally {
      setIsDeleting(false);
      setTrashDialogOpen(false);
      if (toBeRedirected) redirect('/documents');
    }
  };

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
      </div>
      {activeDoc && (
        <div className="flex items-center gap-3 px-4">
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateFavoriteStatus(activeDoc)}
              className="bg-accent dark:bg-accent/50 h-7 w-7 hover:text-[#F59E0D]"
            >
              {activeDoc.isFavorite && <Star className="h-5 w-5 fill-current text-[#F59E0D]" />}
              {!activeDoc.isFavorite && <Star className="h-5 w-5" />}
              <span className="sr-only">Add to favorites</span>
            </Button>
            <Dialog open={trashDialogOpen} onOpenChange={(status) => setTrashDialogOpen(status)}>
              <DialogTrigger asChild>
                <Button
                  className="bg-destructive/35 hover:bg-destructive/55 h-7 w-7 rounded-md"
                  size="icon"
                >
                  <Trash2 className="h-5 w-5 text-[#F43F5E]" />
                  <span className="sr-only">Delete document</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Are you sure you want to permanently delete this
                  document?
                </DialogDescription>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTrashDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(activeDoc)}>
                    {isDeleting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        <p>Deleting...</p>
                      </>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        </div>
      )}
    </header>
  );
}
