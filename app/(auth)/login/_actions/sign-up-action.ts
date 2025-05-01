'use server';

import { signUpWithEmailAndPassword } from '@/lib/auth-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signUpAction(formData: FormData) {
  let redirectPath: string | null = null;

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    await signUpWithEmailAndPassword(email, password, name);
    revalidatePath('/', 'layout');
    redirectPath = '/';
  } catch (err) {
    console.error('SignUp Error', err);
    redirect('/error');
  } finally {
    if (redirectPath) redirect(redirectPath);
  }
}
