import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  favoritesDocumentsAtom,
  type SidebarDocument,
  sidebarDocumentsAtom,
  workspaceDocumentsAtom,
} from '@/store/sidebarDocuments';
import { Copy, FileText, MoreHorizontal, SquarePen, Star, StarOff, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { NavUser } from '@/components/nav-user';
import { useAtom, useAtomValue } from 'jotai';
import { User } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';
import axios from 'axios';

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const workspaceDocuments = useAtomValue(workspaceDocumentsAtom);
  const favoriteDocuments = useAtomValue(favoritesDocumentsAtom);

  return (
    <Sidebar variant="floating" collapsible="offcanvas" className="border-r-0">
      <SidebarHeader>
        <NavUser displayName={user?.displayName} image={user?.image} email={user?.email} />
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        {user && (
          <Button
            className="mx-2 mt-4 text-sm leading-tight tracking-tight"
            variant="secondary"
            onClick={() => router.push('/documents/new')}
          >
            <SquarePen className="text-sidebar-foreground/60 mr-0.5 h-4 w-4" />
            <span className="mr-1.5 mb-0.5">Add a document</span>
          </Button>
        )}

        <SidebarGroup key="favorites">
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1.5">
            {!favoriteDocuments &&
              Array.from({ length: 3 }, (_, index) => <SidebarMenuSkeleton key={index} />)}
            <SidebarMenu>
              {favoriteDocuments &&
                favoriteDocuments.map((item) => {
                  const isActive = pathname === `/documents/${item.id}`;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild className={isActive ? 'bg-muted' : ''}>
                        <Link
                          href={`/documents/${item.id}`}
                          className="font-semibold tracking-tight"
                        >
                          <FileText className="text-sidebar-foreground/60" />
                          <span className={isActive ? '' : 'text-muted-foreground'}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownActions item={item} />
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup key="workspace">
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent className="">
            {!workspaceDocuments &&
              Array.from({ length: 3 }, (_, index) => <SidebarMenuSkeleton key={index} />)}
            <SidebarMenu>
              {workspaceDocuments &&
                workspaceDocuments.map((item) => {
                  const isActive = pathname === `/documents/${item.id}`;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild className={isActive ? 'bg-muted' : ''}>
                        <Link
                          href={`/documents/${item.id}`}
                          className="font-semibold tracking-tight"
                        >
                          <FileText className="text-sidebar-foreground/60" />
                          <span className={isActive ? '' : 'text-muted-foreground'}>
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                      <DropdownActions item={item} />
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function DropdownActions({ item }: { item: SidebarDocument }) {
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
