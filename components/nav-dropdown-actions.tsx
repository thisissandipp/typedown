import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { sidebarDocumentsAtom, type SidebarDocument } from '@/store/sidebarDocuments';
import { Copy, MoreHorizontal, SquarePen, Star, StarOff, Trash2 } from 'lucide-react';
import { SidebarMenuAction } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import axios from 'axios';

export function NavDropdownActions({ item }: { item: SidebarDocument }) {
  const isMobile = useIsMobile();
  const [sidebarDocuments, setSidebarDocuments] = useAtom(sidebarDocumentsAtom);

  const handleFavoriteStatus = async (item: SidebarDocument) => {
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

  return (
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
        <DropdownMenuItem onClick={() => handleFavoriteStatus(item)}>
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
        <DropdownMenuItem className="group">
          <Trash2 className="text-muted-foreground group-hover:text-[#F43F5E]" />
          <span className="group-hover:text-[#F43F5E]">Move to Trash</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
