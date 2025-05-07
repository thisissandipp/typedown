'use client';

import React from 'react';
import axios from 'axios';

export default function DocumentsPage() {
  React.useEffect(() => {
    const syncAuthenticatedUserInfo = async () => {
      try {
        const response = await axios.post('/api/auth/sync-user');
        console.log(response.data.message);
      } catch (error) {
        console.error('Failed to sync user info', error);
      }
    };

    syncAuthenticatedUserInfo();
  }, []);

  return <div>This is the documents page.</div>;
}
