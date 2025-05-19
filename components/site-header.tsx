import { sidebarDocumentsAtom } from '@/store/sidebarDocuments';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';
import { useAtomValue } from 'jotai';

export function SiteHeader() {
  const params = useParams();
  const documentId = params?.id;
  const sidebarDocuments = useAtomValue(sidebarDocumentsAtom);

  const activeDoc = sidebarDocuments?.find((doc) => doc.id === documentId);

  console.log('Params', documentId);
  console.log('Sidebar Documents', sidebarDocuments);
  console.log('Avtive Doc', activeDoc);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        {activeDoc && <h1 className="text-base font-medium">{activeDoc.title}</h1>}
      </div>
    </header>
  );
}
