import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { favoritesDocumentsAtom, workspaceDocumentsAtom } from '@/store/sidebarDocuments';
import { Button } from '@/components/ui/button';
import { NavUser } from '@/components/nav-user';
import { NavFavorites } from './nav-favorites';
import { NavWorkspace } from './nav-workspace';
import { useRouter } from 'next/navigation';
import { SquarePen } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { User } from '@/types';

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();

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
              {favoriteDocuments && <NavFavorites documents={favoriteDocuments} />}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup key="workspace">
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent className="mt-1.5">
            {!workspaceDocuments &&
              Array.from({ length: 3 }, (_, index) => <SidebarMenuSkeleton key={index} />)}
            <SidebarMenu>
              {workspaceDocuments && <NavWorkspace documents={workspaceDocuments} />}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
