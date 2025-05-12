import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Plus, type LucideIcon } from 'lucide-react';
import { NavUser } from '@/components/nav-user';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
}

interface SidebarGroupItem {
  title: string;
  actionIcon: LucideIcon;
  actionTooltip: string;
  destination: string;
}

const sidebarGroupItems: SidebarGroupItem[] = [
  {
    title: 'Personal Workspace',
    actionIcon: Plus,
    actionTooltip: 'Add a document',
    destination: '/documents/new',
  },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter();

  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <NavUser displayName={user?.displayName} image={user?.image} email={user?.email} />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {sidebarGroupItems.map((groupItem) => (
          <SidebarGroup key={groupItem.title}>
            <SidebarGroupLabel>{groupItem.title}</SidebarGroupLabel>
            <SidebarGroupAction onClick={() => router.push(groupItem.destination)}>
              <groupItem.actionIcon className="h-4 w-4" />
              <span className="sr-only">{groupItem.actionTooltip}</span>
            </SidebarGroupAction>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
