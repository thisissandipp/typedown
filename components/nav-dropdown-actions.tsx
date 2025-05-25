import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Copy, Loader2, MoreHorizontal, SquarePen, Star, StarOff, Trash2 } from 'lucide-react';
import { sidebarDocumentsAtom, type SidebarDocument } from '@/store/sidebarDocuments';
import { SidebarMenuAction } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { redirect } from 'next/navigation';
import { Button } from './ui/button';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import axios from 'axios';
import React from 'react';

export function NavDropdownActions({ item }: { item: SidebarDocument }) {
  const isMobile = useIsMobile();
  const [trashDialogOpen, setTrashDialogOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [sidebarDocuments, setSidebarDocuments] = useAtom(sidebarDocumentsAtom);

  const handleFavoriteStatus = async () => {
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
      }
    } catch (error) {
      setSidebarDocuments(previousValue);
      console.error('Error updating favorite', error);
      toast('Something went wrong', {
        description: 'Internal server error while updating the favorite status',
      });
    }
  };

  const handleDelete = async () => {
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
    <Dialog open={trashDialogOpen} onOpenChange={(status) => setTrashDialogOpen(status)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
            <span className="sr-only">More Options</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
        >
          <DropdownMenuItem onClick={handleFavoriteStatus}>
            {item.isFavorite && (
              <>
                <StarOff className="text-muted-foreground" />
                <span>Remove from Favorites</span>
              </>
            )}
            {!item.isFavorite && (
              <>
                <Star className="text-muted-foreground" />
                <span>Add to Favorites</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Copy className="text-muted-foreground" />
            <span>Duplicate</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SquarePen className="text-muted-foreground" />
            <span>Rename document</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem className="group">
              <Trash2 className="text-muted-foreground group-hover:text-[#F43F5E]" />
              <span className="group-hover:text-[#F43F5E]">Move to Trash</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to permanently delete this document?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setTrashDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
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
  );
}
