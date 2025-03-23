'use client';

import { useMutation } from '@tanstack/react-query';
import { addDays, addMonths, addYears, format } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import * as React from 'react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAuth } from '@/contexts/auth-provider';
import paymentService from '@/services/payment.service';
import rentalService from '@/services/rental.service';
import { formatCurrencyFormat } from '@/utils/currency';

import { Vehicle } from '@/types/vehicle.type';

interface VehicleRentalDialogProps {
  vehicle: Vehicle;
  rentalType?: 'daily' | 'monthly' | 'yearly';
  children?: React.ReactNode;
}

export function VehicleRentalDialog({
  vehicle,
  rentalType = 'daily',
  children,
}: VehicleRentalDialogProps) {
  const [pickupLocation, setPickupLocation] = React.useState('Hà Nội');
  const [pickupDetailLocation, setPickupDetailLocation] = React.useState('');
  const [pickupDate, setPickupDate] = React.useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [pickupTime, setPickupTime] = React.useState('10:00');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const calculateRentalDetails = (
    selectedVehicle: Vehicle,
    startDate: Date = new Date(),
  ) => {
    let endDate: Date;
    let totalPrice: number;

    switch (rentalType) {
      case 'monthly':
        endDate = addMonths(startDate, 1);
        totalPrice = selectedVehicle.price_per_month;
        break;
      case 'yearly':
        endDate = addYears(startDate, 1);
        totalPrice = selectedVehicle.price_per_year;
        break;
      default:
        endDate = addDays(startDate, 1);
        totalPrice = selectedVehicle.price_per_day;
    }

    return {
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      total_price: totalPrice,
    };
  };

  const createPaymentMutation = useMutation({
    mutationFn: paymentService.createPayment,
    onSuccess: () => {
      toast({
        title: 'Thuê xe thành công',
        description: 'Đơn hàng đã được xử lý.',
      });
    },
    onError: () => {
      toast({
        title: 'Lỗi thanh toán',
        description:
          'Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.',
        variant: 'destructive',
      });
    },
  });

  const createRentalMutation = useMutation({
    mutationFn: rentalService.createRental,
    onSuccess: (data) => {
      const currentDate = new Date();
      createPaymentMutation.mutate({
        rental_id: data.id,
        user_id: data.user_id,
        amount: data.total_price,
        // @TODO: Implement payment method
        payment_method: 'Credit Card',
        payment_date: currentDate.toISOString(),
        status: 'pending',
      });

      toast({
        title: 'Thuê xe thành công',
        description: `Bạn đã thuê xe ${vehicle.name} thành công. Mã đơn hàng: ${data.id}`,
      });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi thuê xe. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    },
  });

  const handleCreateRental = () => {
    if (!user) {
      toast({
        title: 'Vui lòng đăng nhập',
        description: 'Bạn cần đăng nhập để thuê xe.',
        variant: 'destructive',
      });
      return;
    }

    const userId = user.id;

    const [hours, minutes] = pickupTime.split(':').map(Number);
    const pickupDateTime = new Date(pickupDate);
    pickupDateTime.setHours(hours, minutes);

    const fullPickupLocation = pickupDetailLocation
      ? `${pickupLocation} - ${pickupDetailLocation}`
      : pickupLocation;

    const rentalDetails = calculateRentalDetails(vehicle, pickupDateTime);

    createRentalMutation.mutate({
      user_id: userId || 0,
      vehicle_id: vehicle.id,
      start_time: rentalDetails.start_time,
      end_time: rentalDetails.end_time,
      total_price: rentalDetails.total_price,
      status: 'pending',
      pickup_location: fullPickupLocation,
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className='bg-green-500 hover:bg-green-600'>Đặt xe</Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[520px]'>
        <DialogHeader>
          <DialogTitle>Đặt thuê xe</DialogTitle>
          <DialogDescription>
            <div className='mt-2'>
              <p className='font-medium text-lg'>{vehicle.name}</p>
              <p className='text-sm text-gray-500 mt-1'>
                Giá thuê:{' '}
                {rentalType === 'daily'
                  ? `${formatCurrencyFormat(vehicle.price_per_day)}/ngày`
                  : rentalType === 'monthly'
                    ? `${formatCurrencyFormat(vehicle.price_per_month)}/tháng`
                    : `${formatCurrencyFormat(vehicle.price_per_year)}/năm`}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='pickup-location' className='text-right'>
              Thành phố nhận xe
            </label>
            <div className='col-span-3'>
              <Select value={pickupLocation} onValueChange={setPickupLocation}>
                <SelectTrigger>
                  <SelectValue placeholder='Chọn thành phố' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Hà Nội'>Hà Nội</SelectItem>
                  <SelectItem value='Hồ Chí Minh'>Hồ Chí Minh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='pickup-detail-location' className='text-right'>
              Địa chỉ cụ thể
            </label>
            <div className='col-span-3'>
              <Input
                id='pickup-detail-location'
                placeholder='Nhập địa chỉ cụ thể để nhận xe (tòa nhà, số nhà, đường...)'
                value={pickupDetailLocation}
                onChange={(e) => setPickupDetailLocation(e.target.value)}
              />
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='pickup-date' className='text-right'>
              Ngày nhận xe
            </label>
            <div className='col-span-3 relative'>
              <Input
                id='pickup-date'
                type='date'
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className='pl-10'
              />
              <Calendar className='absolute left-3 top-3 h-4 w-4 text-gray-500' />
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <label htmlFor='pickup-time' className='text-right'>
              Giờ nhận xe
            </label>
            <div className='col-span-3 relative'>
              <Input
                id='pickup-time'
                type='time'
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className='pl-10'
              />
              <Clock className='absolute left-3 top-3 h-4 w-4 text-gray-500' />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleCreateRental}
            disabled={createRentalMutation.isPending}
          >
            {createRentalMutation.isPending
              ? 'Đang xử lý...'
              : 'Xác nhận đặt xe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
