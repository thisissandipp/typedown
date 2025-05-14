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
import { usePathname, useRouter } from 'next/navigation';
import { NavUser } from '@/components/nav-user';
import { SidebarDocument, User } from '@/types';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
  documents: SidebarDocument[] | null;
}

export function AppSidebar({ user, documents }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar variant="floating" collapsible="offcanvas">
      <SidebarHeader>
        <NavUser displayName={user?.displayName} image={user?.image} email={user?.email} />
      </SidebarHeader>
      {/* <SidebarSeparator className='w-[48px]' /> */}
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
                documents.map((item) => {
                  const isActive = pathname === `/documents/${item.id}`;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton size="sm" asChild className={isActive ? 'bg-muted' : ''}>
                        <Link href={`/documents/${item.id}`}>
                          <FileText className="text-sidebar-foreground/60" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
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
