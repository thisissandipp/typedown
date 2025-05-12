import { createClient } from '@/lib/supabase/server-client';
import { type InsertUser } from '@/db/types';
import { usersTable } from '@/db/schema';
import { type User } from '@/types';
import { eq } from 'drizzle-orm';
import { db } from '@/db';

export const ensureUserAvailabilityInDb = async (user: User) => {
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, user.id))
    .limit(1);

  if (existingUser.length === 0) {
    await db.insert(usersTable).values({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      emailConfirmed: user.emailConfirmed,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } satisfies InsertUser);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) return null;

    const [currentUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, data.user.id))
      .limit(1);

    return currentUser ?? null;
  } catch (error) {
    console.error('Error fetching user', error);
    return null;
  }
};
