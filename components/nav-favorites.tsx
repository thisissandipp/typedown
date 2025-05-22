import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavDropdownActions } from '@/components/nav-dropdown-actions';
import { type SidebarDocument } from '@/store/sidebarDocuments';
import { usePathname } from 'next/navigation';
import { FileText, Star } from 'lucide-react';
import Link from 'next/link';

export function NavFavorites({ documents }: { documents: SidebarDocument[] }) {
  const pathname = usePathname();

  if (!documents.length) {
    return (
      <div className="bg-muted text-muted-foreground mx-0.5 flex flex-col items-center justify-center rounded-xl p-6">
        <div className="bg-sidebar flex h-9 w-9 items-center justify-center rounded-full">
          <Star className="text-muted-foreground h-4 w-4 fill-current" />
        </div>
        <p className="text-muted-foreground mt-2.5 text-center text-base font-medium">
          Nothing in Favorites
        </p>
        <p className="text-muted-foreground mt-1 text-xs">Star a document to add it here.</p>
      </div>
    );
  }

  return documents.map((item) => {
    const isActive = pathname === `/documents/${item.id}`;
    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton asChild className={isActive ? 'bg-muted' : ''}>
          <Link href={`/documents/${item.id}`} className="font-semibold tracking-tight">
            <FileText className="text-sidebar-foreground/60" />
            <span className={isActive ? '' : 'text-muted-foreground'}>{item.title}</span>
          </Link>
        </SidebarMenuButton>
        <NavDropdownActions item={item} />
      </SidebarMenuItem>
    );
  });
}
