'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePassword } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import React from 'react';
import { z } from 'zod';

const updatePasswordFormSchema = z
  .object({
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters.',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm Password must be at least 6 characters.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export default function UpdatePasswordPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof updatePasswordFormSchema>>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: z.infer<typeof updatePasswordFormSchema>) => {
    setIsLoading(true);

    const error = await updatePassword(values.password);

    if (error) {
      toast("Sorry, we couldn't update your password", {
        description: error.message,
      });
    } else {
      toast('Password has been reset successfully!', {
        description: 'Redirecting you shortly to the home page',
      });
      redirect('/');
    }

    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        'flex min-h-full flex-1 flex-col justify-center px-6 py-12 sm:mx-auto sm:w-full sm:max-w-md lg:px-8',
        className,
      )}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Update password</CardTitle>
          <CardDescription>Enter your new password for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input id="password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input id="confirmPassword" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <p className="">Updating your password</p>
                    </>
                  ) : (
                    'Update account password'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
