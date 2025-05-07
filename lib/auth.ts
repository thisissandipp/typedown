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
