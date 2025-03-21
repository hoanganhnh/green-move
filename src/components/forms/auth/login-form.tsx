'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import authService, { LoginResponse } from '@/services/auth.service';
import { UserInformationSignInDto } from '@/services/dtos/auth-dto.interface';

// Define validation schema using Yup
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

export function LoginForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<'div'> & {
  imageUrl?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the data for API
      const loginData: UserInformationSignInDto = {
        email: data.email,
        password: data.password,
      };

      // Call the login API
      const response: LoginResponse = await authService.login(loginData);

      // Set the access token in the base service
      if (response.token) {
        authService.setAccessToken(response.token);

        // Redirect to dashboard or home page after successful login
        router.push('/');
      } else {
        setError('Login failed. Invalid response from server.');
      }
    } catch (err) {
      // Handle error
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            'Login failed. Please check your credentials.',
        );
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='overflow-hidden p-0'>
        <CardContent className='grid p-0 md:grid-cols-2'>
          <div className='p-6 md:p-8'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Welcome back</h1>
                <p className='text-muted-foreground text-balance'>
                  Login to your account
                </p>
              </div>

              {error && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex items-center justify-between'>
                          <FormLabel>Email</FormLabel>
                        </div>
                        <FormControl>
                          <Input
                            placeholder='m@example.com'
                            type='email'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem>
                        <div className='flex items-center justify-between'>
                          <FormLabel>Password</FormLabel>
                          <Link
                            href='/forgot-password'
                            className='text-sm text-muted-foreground underline-offset-2 hover:underline'
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <FormControl>
                          <Input type='password' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              </Form>
              <div className='text-center text-sm'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/sign-up'
                  className='hover:underline hover:underline-offset-4'
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
          <div className='bg-primary/50 relative hidden md:block'>
            {imageUrl && (
              <Image
                fill
                src={imageUrl}
                alt='Image'
                className='absolute inset-0 h-full w-full object-cover'
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
