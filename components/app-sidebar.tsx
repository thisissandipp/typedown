import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
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
import { Copy, FileText, MoreHorizontal, Plus, SquarePen, StarOff, Trash2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavUser } from '@/components/nav-user';
import { SidebarDocument, User } from '@/types';
import Link from 'next/link';

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
  documents: SidebarDocument[] | null;
}

export function AppSidebar({ user, documents }: AppSidebarProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="offcanvas" className="border-r-0">
      <SidebarHeader>
        <NavUser displayName={user?.displayName} image={user?.image} email={user?.email} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        <SidebarGroup key="personal-workspace">
          <SidebarGroupLabel>Personal Workspace</SidebarGroupLabel>
          <SidebarGroupAction onClick={() => router.push('/documents/new')}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add a document</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            {!documents &&
              Array.from({ length: 3 }, (_, index) => <SidebarMenuSkeleton key={index} />)}
            <SidebarMenu>
              {documents &&
                documents.map((item) => {
                  const isActive = pathname === `/documents/${item.id}`;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild className={isActive ? 'bg-muted' : ''}>
                        <Link href={`/documents/${item.id}`}>
                          <FileText className="text-sidebar-foreground/60" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
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
                          <DropdownMenuItem>
                            <StarOff className="text-muted-foreground" />
                            <span>Remove from Favorites</span>
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
                            <Trash2 className="text-muted-foreground group-hover:text-destructive" />
                            <span className="group-hover:text-destructive">Move to Trash</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
