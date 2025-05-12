import { NextResponse } from 'next/server';
import { getUser } from '@/lib/auth';
import { type User } from '@/types';

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized or failed to get user from Supabase Auth.' },
        { status: 401 },
      );
    }
    return NextResponse.json({ user: user satisfies User }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user', error);
    return NextResponse.json(
      { message: 'Internal server error while fetching user' },
      { status: 500 },
    );
  }
}
