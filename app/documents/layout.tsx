'use client';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarDocument, User } from '@/types';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import React from 'react';
import axios from 'axios';

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [error, setError] = React.useState<string>('');
  const [documents, setDocuments] = React.useState<SidebarDocument[] | null>(null);

  React.useEffect(() => {
    const syncAuthenticatedUserInfo = async () => {
      try {
        const response = await axios.post('/api/auth/sync-user');
        console.log(response.data.message);
      } catch (error) {
        console.error('Failed to sync user info', error);
      }
    };

    const currentUser = async () => {
      try {
        const response = await axios.get('/api/auth/user');
        if (response.status === 401) {
          redirect('/login');
        }
        if (response.status === 404) {
          setError(response.data.message);
          return;
        }
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to load user', error);
        setError('Failed to load user info');
      }
    };

    syncAuthenticatedUserInfo();
    currentUser();
  }, []);

  React.useEffect(() => {
    const getUserDocuments = async () => {
      if (user) {
        try {
          const response = await axios.get('/api/documents');
          if (response.status === 200) {
            setDocuments(response.data.documents);
          } else {
            setDocuments([]);
          }
        } catch (error) {
          console.error('Failed to load user documents', error);
          setDocuments([]);
        }
      }
    };

    getUserDocuments();
  }, [user]);

  if (error.length !== 0) {
    toast('An error has occurred', {
      description: 'We could not find your profile. Please try signing out and back in.',
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} documents={documents} />
      <SidebarInset>
        <main>
          <SiteHeader />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
