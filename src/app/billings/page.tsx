'use client';

import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

import { useToast } from '@/hooks/use-toast';

import { ReviewDialog } from '@/components/review-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useAuth } from '@/contexts/auth-provider';
import reviewService from '@/services/review.service';

import { Payment } from '@/types/payment.type';
import { Rental } from '@/types/rental.type';
import { Review } from '@/types/review.type';

interface BillingItem {
  rental: Rental;
  payment?: Payment;
  review?: Review;
}

export default function BillingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const loadBillingData = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      // Fetch rentals and payments from API
      const response = await fetch(`/api/billings?userId=${user.id}`);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const billingData = await response.json();

      // Fetch reviews for each rental
      const billingItemsWithReviews = await Promise.all(
        billingData.map(async (item: BillingItem) => {
          try {
            // Check if there's already a review for this rental
            const reviews = await reviewService.getReviews({
              rental_id: item.rental.id,
              user_id: user.id,
            });

            return {
              ...item,
              review: reviews.length > 0 ? reviews[0] : undefined,
            };
          } catch (error) {
            // If there's an error fetching reviews, just return the item as is
            return item;
          }
        }),
      );

      setBillingItems(billingItemsWithReviews);
    } catch (error) {
      // eslint-disable-next-line no-console
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error loading billing data:', error);
      }

      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi tải thông tin thanh toán.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, user?.id]);

  useEffect(() => {
    loadBillingData();
  }, [user, toast, loadBillingData]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Handle opening the review dialog
  const handleOpenReviewDialog = (rental: Rental) => {
    setSelectedRental(rental);
    setIsReviewDialogOpen(true);
  };

  // Handle closing the review dialog
  const handleCloseReviewDialog = () => {
    setIsReviewDialogOpen(false);
    setSelectedRental(null);
  };

  // Handle review submission
  const handleReviewSubmitted = async () => {
    // Refresh the data to show the new review
    if (user?.id) {
      await loadBillingData();
    }
  };

  // Get status badge class based on status
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs';
      case 'cancelled':
        return 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs';
      default:
        return 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs';
    }
  };

  if (isLoading) {
    return (
      <div className='container py-8'>Đang tải thông tin thanh toán...</div>
    );
  }

  return (
    <div className='container py-8'>
      <h1 className='text-2xl font-bold mb-6'>Lịch sử đơn hàng</h1>

      {billingItems.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500'>Bạn chưa có giao dịch nào.</p>
        </div>
      ) : (
        <Table>
          <TableCaption>Danh sách các giao dịch của bạn.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Ngày thuê</TableHead>
              <TableHead>Ngày kết thúc</TableHead>
              <TableHead>Tổng tiền</TableHead>
              <TableHead>Trạng thái đơn hàng</TableHead>
              <TableHead>Trạng thái thanh toán</TableHead>
              <TableHead>Phương thức thanh toán</TableHead>
              <TableHead>Nơi nhận</TableHead>
              <TableHead>Ngày thanh toán</TableHead>
              <TableHead>Đánh giá</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingItems.map((item) => (
              <TableRow key={item.rental.id}>
                <TableCell className='font-medium'>#{item.rental.id}</TableCell>
                <TableCell>{formatDate(item.rental.start_time)}</TableCell>
                <TableCell>{formatDate(item.rental.end_time)}</TableCell>
                <TableCell>{formatCurrency(item.rental.total_price)}</TableCell>
                <TableCell>
                  <span className={getStatusClass(item.rental.status)}>
                    {item.rental.status === 'pending' && 'Chờ xử lý'}
                    {item.rental.status === 'active' && 'Đang thuê'}
                    {item.rental.status === 'completed' && 'Hoàn thành'}
                    {item.rental.status === 'cancelled' && 'Đã hủy'}
                  </span>
                </TableCell>
                <TableCell>
                  {item.payment ? (
                    <span className={getStatusClass(item.payment.status)}>
                      {item.payment.status === 'pending' && 'Chờ thanh toán'}
                      {item.payment.status === 'paid' && 'Đã thanh toán'}
                      {item.payment.status === 'failed' &&
                        'Thanh toán thất bại'}
                      {item.payment.status === 'refunded' && 'Đã hoàn tiền'}
                    </span>
                  ) : (
                    <span className='bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'>
                      Chưa thanh toán
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {item.payment ? item.payment.payment_method : '-'}
                </TableCell>
                <TableCell>{item.rental.pickup_location}</TableCell>
                <TableCell>
                  {item.payment ? formatDate(item.payment.payment_date) : '-'}
                </TableCell>
                <TableCell>
                  {item.review ? (
                    <div className='flex flex-col'>
                      <span className='font-medium'>
                        {item.review.rating}/5 ⭐
                      </span>
                      <span className='text-xs text-gray-500 truncate max-w-[150px]'>
                        {item.review.comment}
                      </span>
                    </div>
                  ) : item.rental.status === 'completed' ? (
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleOpenReviewDialog(item.rental)}
                    >
                      Viết đánh giá
                    </Button>
                  ) : (
                    <span className='text-xs text-gray-500'>
                      Chưa hoàn thành
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Review Dialog */}
      {selectedRental && user && (
        <ReviewDialog
          rental={selectedRental}
          userId={user.id}
          isOpen={isReviewDialogOpen}
          onClose={handleCloseReviewDialog}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}
