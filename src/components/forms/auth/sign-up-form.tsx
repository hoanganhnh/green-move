'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import authService from '@/services/auth.service';
import { UserInformationRegisterDto } from '@/services/dtos/auth-dto.interface';

// Define validation schema using Yup
const signUpSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

type SignUpFormValues = yup.InferType<typeof signUpSchema>;

export function SignUpForm({
  className,
  imageUrl,
  ...props
}: React.ComponentProps<'div'> & {
  imageUrl?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare the data for API
      const registerData: UserInformationRegisterDto = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      };

      // Call the register API
      await authService.register(registerData);

      // Redirect to sign-in page after successful registration
      router.push('/sign-in?registered=true');
    } catch (err) {
      // Handle error
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            'Registration failed. Please try again.',
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
          <form className='p-6 md:p-8' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center text-center'>
                <h1 className='text-2xl font-bold'>Create an account</h1>
                <p className='text-muted-foreground text-balance'>
                  Sign up to get started
                </p>
              </div>

              {error && (
                <Alert variant='destructive'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className='grid gap-3'>
                <Label htmlFor='fullName'>Full Name</Label>
                <Input
                  id='fullName'
                  {...register('fullName')}
                  placeholder='John Doe'
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && (
                  <p className='text-sm text-red-500'>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email')}
                  placeholder='johndoe@example.com'
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                  placeholder='********'
                  aria-invalid={!!errors.password}
                />
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className='grid gap-3'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  {...register('confirmPassword')}
                  placeholder='********'
                  aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <p className='text-sm text-red-500'>
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
              <div className='text-center text-sm'>
                Already have an account?{' '}
                <Link
                  href='/sign-in'
                  className='hover:underline hover:underline-offset-4'
                >
                  Login
                </Link>
              </div>
            </div>
          </form>
          <div className='bg-primary/50 relative hidden md:block'>
            {imageUrl && (
              <Image
                fill
                src={imageUrl}
                alt='Sign up illustration'
                className='absolute inset-0 h-full w-full object-cover'
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
