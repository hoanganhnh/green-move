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

import { UpdatePaymentDto } from '@/services/dtos/payment-dto.interface';
import paymentService from '@/services/payment.service';

import { Payment } from '@/types/payment.type';

interface EditPaymentFormData {
  amount: number;
  payment_method: string;
  payment_date: string;
  status: 'pending' | 'paid' | 'cancelled';
}

interface EditPaymentDialogProps {
  payment: Payment;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPaymentDialog({
  payment,
  isOpen,
  onClose,
  onSuccess,
}: EditPaymentDialogProps) {
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
  } = useForm<EditPaymentFormData>({
    defaultValues: {
      amount: payment.amount,
      payment_method: payment.payment_method,
      payment_date: formatDateForInput(payment.payment_date),
      status: payment.status as 'pending' | 'paid' | 'cancelled',
    },
  });

  // Handle status change with Select component
  const handleStatusChange = (value: string) => {
    setValue('status', value as 'pending' | 'paid' | 'cancelled');
  };

  const onSubmit = async (data: EditPaymentFormData) => {
    try {
      setIsSubmitting(true);

      const updateData: UpdatePaymentDto = {
        amount: data.amount,
        payment_method: data.payment_method,
        payment_date: new Date(data.payment_date).toISOString(),
        status: data.status,
      };

      await paymentService.updatePayment(payment.id, updateData);

      toast({
        title: 'Payment updated',
        description: 'Payment has been updated successfully',
      });

      onSuccess();
      onClose();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
          <DialogDescription>
            Make changes to the payment details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='amount' className='text-right'>
                Amount
              </Label>
              <Input
                id='amount'
                type='number'
                step='0.01'
                className='col-span-3'
                {...register('amount', {
                  required: 'Amount is required',
                  min: { value: 0, message: 'Amount must be positive' },
                })}
              />
              {errors.amount && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='payment_method' className='text-right'>
                Payment Method
              </Label>
              <Input
                id='payment_method'
                className='col-span-3'
                {...register('payment_method', {
                  required: 'Payment method is required',
                })}
              />
              {errors.payment_method && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.payment_method.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='payment_date' className='text-right'>
                Payment Date
              </Label>
              <Input
                id='payment_date'
                type='datetime-local'
                className='col-span-3'
                {...register('payment_date', {
                  required: 'Payment date is required',
                })}
              />
              {errors.payment_date && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.payment_date.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Select
                onValueChange={handleStatusChange}
                defaultValue={payment.status}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='pending'>Pending</SelectItem>
                  <SelectItem value='paid'>Paid</SelectItem>
                  <SelectItem value='cancelled'>Cancelled</SelectItem>
                  <SelectItem value='refunded'>Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditPaymentDialog;
