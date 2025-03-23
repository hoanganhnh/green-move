'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UpdateUserDto } from '@/services/dtos/user-dto.interface';
import userService from '@/services/user.service';

import { UserProfile } from '@/types/user.type';

interface EditUserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  password?: string;
}

interface EditUserDialogProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  { value: 'USER', label: 'User' },
  { value: 'ADMIN', label: 'Admin' },
];

export default function EditUserDialog({
  user,
  isOpen,
  onClose,
  onSuccess,
}: EditUserDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditUserFormData>({
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      password: '',
    },
  });

  const onSubmit = async (data: EditUserFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare update data
      const updateData: UpdateUserDto = {
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber,
        role_id: data.role === 'ADMIN' ? 1 : 2, // Assuming role_id 1 is admin and 2 is user
      };

      // Only include password if it's provided
      if (data.password && data.password.trim() !== '') {
        updateData.password = data.password;
      }

      // Update user
      await userService.updateUser(user.id, updateData);

      toast({
        title: 'User updated',
        description: 'User has been updated successfully',
      });

      onSuccess();
      onClose();
    } catch (error) {
      // Log error to monitoring service in production
      toast({
        title: 'Error',
        description: 'Failed to update user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='fullName' className='text-right'>
                Full Name
              </Label>
              <Input
                id='fullName'
                className='col-span-3'
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                className='col-span-3'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='phoneNumber' className='text-right'>
                Phone Number
              </Label>
              <Input
                id='phoneNumber'
                className='col-span-3'
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                })}
              />
              {errors.phoneNumber && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role' className='text-right'>
                Role
              </Label>
              <div className='col-span-3'>
                <Select
                  defaultValue={user.role}
                  onValueChange={(value) => setValue('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='password' className='text-right'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                className='col-span-3'
                placeholder='Leave blank to keep current password'
                {...register('password')}
              />
              {errors.password && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
