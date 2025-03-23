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
  DialogTrigger,
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

import { CreateUserDto } from '@/services/dtos/user-dto.interface';
import userService from '@/services/user.service';

interface AddUserFormData {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  role_id: number;
}

interface AddUserDialogProps {
  trigger: React.ReactNode;
  onSuccess?: () => void;
}

const ROLES = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'User' },
];

export default function AddUserDialog({
  trigger,
  onSuccess,
}: AddUserDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddUserFormData>({
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      phone_number: '',
      role_id: 2, // Default to User role
    },
  });

  const onSubmit = async (data: AddUserFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare create data
      const createData: CreateUserDto = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        phone_number: data.phone_number,
        role_id: data.role_id,
      };

      // Create user
      await userService.createUser(createData);

      toast({
        title: 'User created',
        description: 'User has been created successfully',
      });

      // Reset form and close dialog
      reset();
      setOpen(false);

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Log error to monitoring service in production
      toast({
        title: 'Error',
        description: 'Failed to create user. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. Fill in all the required fields.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='full_name' className='text-right'>
                Full Name
              </Label>
              <Input
                id='full_name'
                className='col-span-3'
                {...register('full_name', {
                  required: 'Full name is required',
                })}
              />
              {errors.full_name && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.full_name.message}
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
              <Label htmlFor='password' className='text-right'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                className='col-span-3'
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              {errors.password && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='phone_number' className='text-right'>
                Phone Number
              </Label>
              <Input
                id='phone_number'
                className='col-span-3'
                {...register('phone_number', {
                  required: 'Phone number is required',
                })}
              />
              {errors.phone_number && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.phone_number.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='role_id' className='text-right'>
                Role
              </Label>
              <div className='col-span-3'>
                <Select
                  defaultValue='2'
                  onValueChange={(value) =>
                    setValue('role_id', parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select role' />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value.toString()}
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
