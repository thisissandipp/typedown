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
import { signInWithGoogle, signUpWithEmailAndPassword } from '@/lib/auth-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import React from 'react';
import { z } from 'zod';

const registerFormSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
  email: z.string().email({ message: 'Email must be a valid one.' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export default function RegisterPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isUserCreationSuccess, setIsUserCreationSuccess] = React.useState(false);

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    setIsLoading(true);
    const error = await signUpWithEmailAndPassword(values.email, values.password, values.name);
    if (error) {
      toast("Sorry, we couldn't create your account!", { description: error.message });
    } else {
      form.reset();
      setIsUserCreationSuccess(true);
    }
    setIsUserCreationSuccess(true);
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
      {isUserCreationSuccess && (
        <Alert className="bg-green-100 dark:bg-green-900">
          <UserCheck className="h-4 w-4" />
          <AlertTitle>Successfully registered!</AlertTitle>
          <AlertDescription className="text-gray-700 dark:text-gray-300">
            Account created successfully. Please check your inbox to confirm your email.
          </AlertDescription>
        </Alert>
      )}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">Create new account</CardTitle>
          <CardDescription>Enter your personal details below to sign up</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input id="name" type="text" placeholder="John Doe" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                            placeholder="john@doe.com"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                <Button type="submit" className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <p className="">Creating your account...</p>
                    </>
                  ) : (
                    'Create your account'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={signInWithGoogle}
                  variant="outline"
                  className="w-full"
                >
                  Continue with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
