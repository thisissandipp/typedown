'use server';

import { createClient } from '@/lib/supabase/server-client';
import { type AuthError } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthError | void> => {
  const supabase = await createClient();

  // Somehow define first name and last name from provided name
  const nameArray = name.split(' ');
  const lastName = nameArray.pop();
  const firstName = nameArray.join(' ');

  const data = { first_name: firstName, last_name: lastName };
  const { error } = await supabase.auth.signUp({ email, password, options: { data } });

  if (error) return error;
  else revalidatePath('/', 'layout');
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string,
): Promise<AuthError | void> => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return error;
  else revalidatePath('/', 'layout');
};
