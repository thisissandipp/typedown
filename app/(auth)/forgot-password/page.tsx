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
import { sendPasswordResetLink } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import React from 'react';
import { z } from 'zod';

const forgotPasswordFormSchema = z.object({
  email: z.string().email({ message: 'Email must be a valid one.' }),
});

export default function ForgotPasswordPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordFormSchema>) => {
    setIsLoading(true);
    const error = await sendPasswordResetLink(values.email);

    if (error) {
      toast("Sorry, we couldn't send the reset password link", {
        description: error.message,
      });
    } else {
      toast('Password reset link sent!', {
        description: 'Please check your email and reset your password',
      });
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
          <CardTitle className="text-2xl">Forgot password?</CardTitle>
          <CardDescription>Enter your email to receive password reset link</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            {...field}
                          />
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
                      <p className="">Sending password reset link...</p>
                    </>
                  ) : (
                    'Send password reset link'
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
