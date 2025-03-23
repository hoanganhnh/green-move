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

import { UpdateRentalDto } from '@/services/dtos/rental-dto.interface';
import rentalService from '@/services/rental.service';

import { Rental } from '@/types/rental.type';

interface EditRentalFormData {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  end_time: string;
  total_price: number;
  pickup_location: string;
}

interface EditRentalDialogProps {
  rental: Rental;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditRentalDialog({
  rental,
  isOpen,
  onClose,
  onSuccess,
}: EditRentalDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Convert ISO date string to local datetime-local format
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditRentalFormData>({
    defaultValues: {
      status: rental.status as
        | 'pending'
        | 'confirmed'
        | 'completed'
        | 'cancelled',
      end_time: formatDateForInput(rental.end_time),
      total_price: rental.total_price,
      pickup_location: rental.pickup_location || '',
    },
  });

  // Handle status change with Select component
  const handleStatusChange = (value: string) => {
    setValue(
      'status',
      value as 'pending' | 'confirmed' | 'completed' | 'cancelled',
    );
  };

  const onSubmit = async (data: EditRentalFormData) => {
    try {
      setIsSubmitting(true);

      const updateData: UpdateRentalDto = {
        status: data.status,
        end_time: new Date(data.end_time).toISOString(),
        total_price: data.total_price,
        pickup_location: data.pickup_location,
      };

      await rentalService.updateRental(rental.id, updateData);

      toast({
        title: 'Rental updated',
        description: `Rental #${rental.id} has been updated successfully.`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An error occurred while updating the rental. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Edit Rental</DialogTitle>
          <DialogDescription>
            Update the details for rental #{rental.id}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <div className='col-span-3'>
                <Select
                  defaultValue={rental.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                    <SelectItem value='cancelled'>Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='end_time' className='text-right'>
                End Time
              </Label>
              <Input
                id='end_time'
                type='datetime-local'
                className='col-span-3'
                {...register('end_time', {
                  required: 'End time is required',
                })}
              />
              {errors.end_time && (
                <p className='text-sm text-red-500 col-span-4 text-right'>
                  {errors.end_time.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='total_price' className='text-right'>
                Total Price
              </Label>
              <Input
                id='total_price'
                type='number'
                className='col-span-3'
                {...register('total_price', {
                  required: 'Total price is required',
                  min: {
                    value: 0,
                    message: 'Total price must be greater than or equal to 0',
                  },
                })}
              />
              {errors.total_price && (
                <p className='text-sm text-red-500 col-span-4 text-right'>
                  {errors.total_price.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='pickup_location' className='text-right'>
                Pickup Location
              </Label>
              <Input
                id='pickup_location'
                className='col-span-3'
                {...register('pickup_location')}
              />
              {errors.pickup_location && (
                <p className='text-sm text-red-500 col-span-4 text-right'>
                  {errors.pickup_location.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditRentalDialog;
