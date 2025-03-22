'use client';

import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VehicleRentalDialog } from '@/components/vehicle-rental-dialog';

import vehicleService from '@/services/vehicle.service';

import { Vehicle } from '@/types/vehicle.type';

export default function VehicleContainer() {
  const [selectedTab, setSelectedTab] = React.useState('daily');
  const [location, setLocation] = React.useState('Hà Nội');

  const [filterVehicle, setFilterVehicle] = React.useState<Vehicle[]>([]);

  const router = useRouter();

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
                {car.status === 'available' ? (
                  <VehicleRentalDialog
                    vehicle={car}
                    rentalType={selectedTab as 'daily' | 'monthly' | 'yearly'}
                  >
                    <Button
                      variant='default'
                      className='w-full bg-emerald-500 hover:bg-emerald-600'
                    >
                      Đặt xe ngay
                    </Button>
                  </VehicleRentalDialog>
                ) : (
                  <Button
                    variant='outline'
                    className='w-full text-gray-500 border-gray-300'
                    disabled
                  >
                    Hết xe
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
