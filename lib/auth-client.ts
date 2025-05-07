'use server';

import { createClient } from '@/lib/supabase/server-client';
import { type AuthError } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthError | void> => {
  const supabase = await createClient();

  const data = { full_name: name };
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

export const sendPasswordResetLink = async (email: string): Promise<AuthError | void> => {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return error;
};

export const updatePassword = async (password: string): Promise<AuthError | void> => {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return error;
};

export const signInWithGoogle = async (): Promise<AuthError | void> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/callback`,
    },
  });

  if (error) return error;
  if (data.url) redirect(data.url);
};

export const logOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
};
