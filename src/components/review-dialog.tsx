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
import { Textarea } from '@/components/ui/textarea';

import reviewService from '@/services/review.service';

import { Rental } from '@/types/rental.type';

interface ReviewFormData {
  rating: number;
  comment: string;
}

interface ReviewDialogProps {
  rental: Rental;
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export function ReviewDialog({
  rental,
  userId,
  isOpen,
  onClose,
  onReviewSubmitted,
}: ReviewDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      await reviewService.createReview({
        rental_id: rental.id,
        user_id: userId,
        rating: data.rating,
        comment: data.comment,
      });

      toast({
        title: 'Đánh giá thành công',
        description: 'Cảm ơn bạn đã đánh giá dịch vụ của chúng tôi.',
      });

      reset();
      onReviewSubmitted();
      onClose();
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại sau.',
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
          <DialogTitle>Đánh giá dịch vụ</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn về dịch vụ thuê xe #{rental.id}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='rating' className='text-right'>
                Đánh giá
              </Label>
              <Input
                id='rating'
                type='number'
                min='1'
                max='5'
                className='col-span-3'
                {...register('rating', {
                  required: 'Vui lòng chọn đánh giá',
                  min: {
                    value: 1,
                    message: 'Đánh giá phải từ 1-5',
                  },
                  max: {
                    value: 5,
                    message: 'Đánh giá phải từ 1-5',
                  },
                })}
              />
              {errors.rating && (
                <p className='text-sm text-red-500 col-span-4 text-right'>
                  {errors.rating.message}
                </p>
              )}
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='comment' className='text-right'>
                Nhận xét
              </Label>
              <Textarea
                id='comment'
                className='col-span-3'
                rows={4}
                placeholder='Chia sẻ trải nghiệm của bạn...'
                {...register('comment', {
                  required: 'Vui lòng nhập nhận xét',
                  minLength: {
                    value: 10,
                    message: 'Nhận xét phải có ít nhất 10 ký tự',
                  },
                })}
              />
              {errors.comment && (
                <p className='text-sm text-red-500 col-span-4 text-right'>
                  {errors.comment.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Hủy
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
