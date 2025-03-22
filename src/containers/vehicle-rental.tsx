'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { addDays, addMonths, addYears, format } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useAuth } from '@/contexts/auth-provider';
import rentalService from '@/services/rental.service';
import vehicleService from '@/services/vehicle.service';

import { Vehicle } from '@/types/vehicle.type';

export default function VehicleContainer() {
  const [selectedTab, setSelectedTab] = React.useState('daily');
  const [location, setLocation] = React.useState('Hà Nội');
  const [pickupLocation, setPickupLocation] = React.useState('Hà Nội');
  const [pickupDetailLocation, setPickupDetailLocation] = React.useState('');
  const [pickupDate, setPickupDate] = React.useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [pickupTime, setPickupTime] = React.useState('10:00');
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [filterVehicle, setFilterVehicle] = React.useState<Vehicle[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  const {
    data: vehicles,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => vehicleService.getVehicles(),
  });

  React.useEffect(() => {
    if (vehicles) {
      setFilterVehicle(
        vehicles.filter((vehicle) => vehicle.type === selectedTab),
      );
    }
  }, [vehicles, selectedTab]);

  const locationMap: Record<string, number> = {
    'Hà Nội': 1,
    'Hồ Chí Minh': 2,
  };

  const getLocationById = (locationId: number): string => {
    return (
      Object.keys(locationMap).find((key) => locationMap[key] === locationId) ||
      'Hà Nội'
    );
  };

  const getLocationId = (locationName: string): number => {
    return locationMap[locationName] || 1;
  };

  const getVehicleByLocation = () => {
    return (
      vehicles
        ?.filter((vehicle) => vehicle.location_id === getLocationId(location))
        .filter((vehicle) => vehicle.type === selectedTab) || []
    );
  };

  const handleSearchVehicle = () => {
    const vehicleByLocation = getVehicleByLocation();
    setFilterVehicle(vehicleByLocation);
  };

  const onGetPriceVehicle = (vehicle: Vehicle) => {
    if (selectedTab === 'daily') {
      return `${vehicle.price_per_day} VNĐ/ngày`;
    }
    if (selectedTab === 'monthly') {
      return `${vehicle.price_per_month} VNĐ/tháng`;
    }
    if (selectedTab === 'yearly') {
      return `${vehicle.price_per_year} VNĐ/năm`;
    }
    return 0;
  };

  const calculateRentalDetails = (
    vehicle: Vehicle,
    startDate: Date = new Date(),
  ) => {
    let endDate: Date;
    let totalPrice: number;

    switch (selectedTab) {
      case 'daily':
        endDate = addDays(startDate, 1);
        totalPrice = vehicle.price_per_day;
        break;
      case 'monthly':
        endDate = addMonths(startDate, 1);
        totalPrice = vehicle.price_per_month;
        break;
      case 'yearly':
        endDate = addYears(startDate, 1);
        totalPrice = vehicle.price_per_year;
        break;
      default:
        endDate = addDays(startDate, 1);
        totalPrice = vehicle.price_per_day;
    }

    return {
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      total_price: totalPrice,
    };
  };

  const createRentalMutation = useMutation({
    mutationFn: rentalService.createRental,
    onSuccess: (data) => {
      toast({
        title: 'Thuê xe thành công',
        description: `Bạn đã thuê xe ${selectedVehicle?.name} thành công. Mã đơn hàng: ${data.id}`,
      });
      setSelectedVehicle(null);
    },
    onError: () => {
      toast({
        title: 'Lỗi',
        description: 'Đã xảy ra lỗi khi thuê xe. Vui lòng thử lại sau.',
        variant: 'destructive',
      });
    },
  });

  const { user } = useAuth();

  const openRentalDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setPickupDetailLocation('');
    setIsDialogOpen(true);
  };

  const handleCreateRental = () => {
    if (!selectedVehicle) return;

    const userId = user?.id;

    const [hours, minutes] = pickupTime.split(':').map(Number);
    const pickupDateTime = new Date(pickupDate);
    pickupDateTime.setHours(hours, minutes);

    const fullPickupLocation = pickupDetailLocation
      ? `${pickupLocation} - ${pickupDetailLocation}`
      : pickupLocation;

    const rentalDetails = calculateRentalDetails(
      selectedVehicle,
      pickupDateTime,
    );

    createRentalMutation.mutate({
      user_id: userId || 0,
      vehicle_id: selectedVehicle.id,
      start_time: rentalDetails.start_time,
      end_time: rentalDetails.end_time,
      total_price: rentalDetails.total_price,
      status: 'pending',
      pickup_location: fullPickupLocation,
    });

    setIsDialogOpen(false);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 bg-white rounded-lg shadow-md p-6'>
        <Tabs defaultValue='daily' onValueChange={setSelectedTab}>
          <TabsList className='grid w-full grid-cols-3 mb-6'>
            <TabsTrigger
              value='daily'
              className={
                selectedTab === 'daily' ? 'bg-emerald-500 text-white' : ''
              }
              onClick={() => {
                router.push('/?type=daily');
              }}
            >
              <span className='font-medium'>Thuê ngày</span>
            </TabsTrigger>
            <TabsTrigger
              value='monthly'
              className={
                selectedTab === 'monthly' ? 'bg-emerald-500 text-white' : ''
              }
              onClick={() => {
                router.push('/?type=monthly');
              }}
            >
              <Link href='/?type=monthly'>
                <span className='font-medium'>Thuê tháng</span>
                <span className='text-xs text-blue-500 ml-2 bg-blue-50 px-2 py-0.5 rounded'>
                  Đặc quyền
                </span>
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value='yearly'
              className={
                selectedTab === 'yearly' ? 'bg-emerald-500 text-white' : ''
              }
              onClick={() => {
                router.push('/?type=yearly');
              }}
            >
              <Link href='/?type=yearly'>
                <span className='font-medium'>Thuê năm</span>
                <span className='text-xs text-blue-500 ml-2 bg-blue-50 px-2 py-0.5 rounded'>
                  Đặc quyền
                </span>
              </Link>
            </TabsTrigger>
          </TabsList>

          <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
            <div className='md:col-span-1'>
              <label className='block text-sm font-medium mb-2'>
                Tỉnh/Thành phố
              </label>
              <Select defaultValue={location} onValueChange={setLocation}>
                <SelectTrigger className='w-full'>
                  <div className='flex items-center'>
                    <MapPin className='w-4 h-4 mr-2' />
                    <SelectValue placeholder='Chọn thành phố' />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Hà Nội'>Hà Nội</SelectItem>
                  <SelectItem value='Hồ Chí Minh'>Hồ Chí Minh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSearchVehicle}
            className='w-full mt-10 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-6'
          >
            Tìm kiếm xe
          </Button>
        </Tabs>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500'></div>
        </div>
      ) : error ? (
        <div className='p-6 text-center text-red-500'>
          <p>Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filterVehicle.map((car) => (
            <Card
              key={car.id}
              className={`overflow-hidden ${car.status !== 'available' ? 'opacity-80' : ''}`}
            >
              <Link href={`/vehicles/${car.id}`} key={car.id}>
                <div className='relative'>
                  <Image
                    src={car.image || '/placeholder.svg'}
                    alt={car.name}
                    width={400}
                    height={300}
                    className='w-full h-64 object-cover'
                  />
                  <div className='absolute top-4 left-4'>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        car.status === 'available'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {car.status === 'available' ? 'Miễn phí sạc' : 'Hết xe'}
                    </span>
                  </div>
                </div>

                <CardContent className='p-4'>
                  <div className='mb-4'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-500'>Chỉ từ</span>
                      <span className='text-xl font-bold text-emerald-500'>
                        {onGetPriceVehicle(car)}
                      </span>
                    </div>
                  </div>

                  <h3 className='text-xl font-bold mb-2'>{car.name}</h3>
                  <div className='grid grid-cols-2 gap-3 mb-4'>
                    <div className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-gray-500'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                        <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h3.5a1 1 0 00.8-.4l2.5-3.33a1 1 0 00.2-.6V8a1 1 0 00-1-1h-1.5V5a1 1 0 00-1-1H3z' />
                      </svg>
                      <span className='text-sm'>{car.type}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 text-gray-500'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span className='text-sm'>
                        {getLocationById(car.location_id)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Link>
              <CardFooter className='p-4 pt-0'>
                <Button
                  variant={car.status === 'available' ? 'default' : 'outline'}
                  className={`w-full ${car.status === 'available' ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-gray-500 border-gray-300'}`}
                  disabled={
                    car.status !== 'available' || createRentalMutation.isPending
                  }
                  onClick={() => openRentalDialog(car)}
                >
                  {createRentalMutation.isPending &&
                  selectedVehicle?.id === car.id
                    ? 'Đang xử lý...'
                    : car.status === 'available'
                      ? 'Đặt xe ngay'
                      : 'Hết xe'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Rental Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[520px]'>
          <DialogHeader>
            <DialogTitle>Đặt thuê xe</DialogTitle>
            <DialogDescription>
              {selectedVehicle && (
                <div className='mt-2'>
                  <p className='font-medium text-lg'>{selectedVehicle.name}</p>
                  <p className='text-sm text-gray-500 mt-1'>
                    Giá thuê:{' '}
                    {selectedTab === 'daily'
                      ? `${selectedVehicle.price_per_day} VNĐ/ngày`
                      : selectedTab === 'monthly'
                        ? `${selectedVehicle.price_per_month} VNĐ/tháng`
                        : `${selectedVehicle.price_per_year} VNĐ/năm`}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <label htmlFor='pickup-location' className='text-right'>
                Thành phố nhận xe
              </label>
              <div className='col-span-3'>
                <Select
                  value={pickupLocation}
                  onValueChange={setPickupLocation}
                >
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
    </div>
  );
}
