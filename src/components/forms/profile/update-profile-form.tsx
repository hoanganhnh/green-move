'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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

import { useAuth } from '@/contexts/auth-provider';
import { UpdateUserDto } from '@/services/dtos/user-dto.interface';
import userService from '@/services/user.service';

import { UserProfile } from '@/types/user.type';

// Define validation schema using Zod
const updateProfileSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Please enter a valid email'),
    phoneNumber: z
      .string()
      .regex(
        /^\+?[1-9]\d{1,14}$/,
        'Please enter a valid phone number (e.g., +1234567890)',
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    },
  );

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

interface UpdateProfileFormProps extends React.ComponentProps<'div'> {
  user: UserProfile;
}

export function UpdateProfileForm({
  className,
  user,
  ...props
}: UpdateProfileFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const { updateUser } = useAuth();

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: UpdateProfileFormValues) => {
    try {
      setIsLoading(true);
      setError(null);

      // Prepare the data for API
      const updateData: UpdateUserDto = {
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber,
      };

      // Only include password if it's provided
      if (data.password) {
        updateData.password = data.password;
      }

      // Call the update user method from user service
      await userService.updateUser(user.id, updateData);

      toast({
        title: 'Profile đã được cập nhật',
        description: 'Thông tin cá nhân của bạn đã được cập nhật',
      });

      updateUser({
        ...user,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      });

      // Refresh the page to show updated data
      router.refresh();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col'>
              <h1 className='text-2xl font-bold'>Update Profile</h1>
              <p className='text-muted-foreground'>
                Update your personal information
              </p>
            </div>

            {error && (
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder='John Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='johndoe@example.com'
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
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='+1234567890'
                          type='tel'
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
                      <FormLabel>New Password (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Leave blank to keep current password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='Confirm new password'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end'>
                  <Button type='submit' disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UpdateProfileForm;
