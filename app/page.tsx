'use client';

import { logOut } from '@/lib/auth-client';

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl font-semibold text-red-600">typedown</h1>
      <button onClick={logOut}>Log Out</button>
    </main>
  );
}
