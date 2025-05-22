import { type SidebarDocument, sidebarDocumentsAtom } from '@/store/sidebarDocuments';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Star } from 'lucide-react';
import { useAtom } from 'jotai';
import { toast } from 'sonner';
import axios from 'axios';

export function SiteHeader() {
  const params = useParams();
  const documentId = params?.id;
  const [sidebarDocuments, setSidebarDocuments] = useAtom(sidebarDocumentsAtom);

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
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
      </div>
      {activeDoc && (
        <div className="flex items-center gap-2 px-4">
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateFavoriteStatus(activeDoc)}
              className="bg-accent dark:bg-accent/50 h-7 w-7"
            >
              {activeDoc.isFavorite && <Star className="h-5 w-5 fill-current text-[#F59E0D]" />}
              {!activeDoc.isFavorite && <Star className="h-5 w-5" />}
              <span className="sr-only">Add to favorites</span>
            </Button>
            {/* <Button className="bg-destructive/55 hover:bg-destructive/35 rounded-md" size="sm">
                <Trash2 className="h-5 w-5 text-[#F43F5E]" />
                <span className="sr-only">Delete document</span>
              </Button> */}
          </>
        </div>
      )}
    </header>
  );
}
