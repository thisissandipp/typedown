import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/nav-user';
import { SidebarDocument, User } from '@/types';
import { FileText, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
  documents: SidebarDocument[] | null;
}

export function AppSidebar({ user, documents }: AppSidebarProps) {
  const router = useRouter();

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <NavUser displayName={user?.displayName} image={user?.image} email={user?.email} />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
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
                documents.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton size="sm" asChild>
                      <a href={`/documents/${item.id}`}>
                        <FileText className="text-sidebar-foreground/60" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
