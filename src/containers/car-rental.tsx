'use client';

import { Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CarProps {
  id: string;
  name: string;
  type: string;
  range: string;
  seats: number;
  trunk: string;
  price: string;
  available: boolean;
  image: string;
}

export default function CarRental() {
  const [selectedTab, setSelectedTab] = React.useState('daily');
  const [pickupDate, setPickupDate] = React.useState('06/03/2025');
  const [pickupTime, setPickupTime] = React.useState('20:50');
  const [dropoffDate, setDropoffDate] = React.useState('07/03/2025');
  const [dropoffTime, setDropoffTime] = React.useState('20:50');
  const [location, setLocation] = React.useState('Hà Nội');

  const cars: CarProps[] = [
    {
      id: 'vf3',
      name: 'VinFast VF 3',
      type: 'Minicar',
      range: '210km (NEDC)',
      seats: 4,
      trunk: '285L',
      price: '650.000',
      available: true,
      image: '/placeholder.svg',
    },
    {
      id: 'vf6-plus',
      name: 'VinFast VF 6 Plus',
      type: 'B-SUV',
      range: '460km (NEDC)',
      seats: 5,
      trunk: '423L',
      price: '1.200.000',
      available: false,
      image: '/placeholder.svg',
    },
    {
      id: 'vf6s',
      name: 'VinFast VF 6S',
      type: 'B-SUV',
      range: '480km (NEDC)',
      seats: 5,
      trunk: '423L',
      price: '1.050.000',
      available: false,
      image: '/placeholder.svg',
    },
    {
      id: 'vf7-1',
      name: 'VinFast VF 7',
      type: 'C-SUV',
      range: '500km (NEDC)',
      seats: 5,
      trunk: '500L',
      price: '1.750.000',
      available: false,
      image: '/placeholder.svg',
    },
    {
      id: 'vf7-2',
      name: 'VinFast VF 7',
      type: 'C-SUV',
      range: '500km (NEDC)',
      seats: 5,
      trunk: '500L',
      price: '1.450.000',
      available: false,
      image: '/placeholder.svg',
    },
    {
      id: 'vf8',
      name: 'VinFast VF 8',
      type: 'D-SUV',
      range: '550km (NEDC)',
      seats: 7,
      trunk: '620L',
      price: '1.750.000',
      available: false,
      image: '/placeholder.svg',
    },
  ];

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
            >
              <span className='font-medium'>Thuê ngày</span>
              <span className='text-xs text-blue-500 ml-2 bg-blue-50 px-2 py-0.5 rounded'>
                Đặc quyền
              </span>
            </TabsTrigger>
            <TabsTrigger
              value='monthly'
              className={
                selectedTab === 'monthly' ? 'bg-emerald-500 text-white' : ''
              }
            >
              <span className='font-medium'>Thuê tháng</span>
              <span className='text-xs text-blue-500 ml-2 bg-blue-50 px-2 py-0.5 rounded'>
                Đặc quyền
              </span>
            </TabsTrigger>
            <TabsTrigger
              value='yearly'
              className={
                selectedTab === 'yearly' ? 'bg-emerald-500 text-white' : ''
              }
            >
              <span className='font-medium'>Thuê năm</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='daily' className='space-y-4'>
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
                    <SelectItem value='Đà Nẵng'>Đà Nẵng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='md:col-span-1'>
                <label className='block text-sm font-medium mb-2'>
                  Ngày nhận xe
                </label>
                <div className='relative'>
                  <Input
                    type='text'
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className='pl-10'
                  />
                  <Calendar className='absolute left-3 top-3 h-4 w-4 text-gray-500' />
                </div>
              </div>

              <div className='md:col-span-1'>
                <label className='block text-sm font-medium mb-2'>
                  Giờ nhận
                </label>
                <div className='relative'>
                  <Input
                    type='text'
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className='pl-10'
                  />
                  <Clock className='absolute left-3 top-3 h-4 w-4 text-gray-500' />
                </div>
              </div>

              <div className='md:col-span-1'>
                <label className='block text-sm font-medium mb-2'>
                  Ngày trả xe
                </label>
                <div className='relative'>
                  <Input
                    type='text'
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    className='pl-10'
                  />
                  <Calendar className='absolute left-3 top-3 h-4 w-4 text-gray-500' />
                </div>
              </div>

              <div className='md:col-span-1'>
                <label className='block text-sm font-medium mb-2'>
                  Giờ trả
                </label>
                <div className='relative'>
                  <Input
                    type='text'
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    className='pl-10'
                  />
                  <Clock className='absolute left-3 top-3 h-4 w-4 text-gray-500' />
                </div>
              </div>
            </div>

            <Button className='w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-6'>
              Tìm kiếm xe
            </Button>
          </TabsContent>

          <TabsContent value='monthly'>
            <div className='p-4 text-center text-gray-500'>
              Monthly rental options will appear here
            </div>
          </TabsContent>

          <TabsContent value='yearly'>
            <div className='p-4 text-center text-gray-500'>
              Yearly rental options will appear here
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {cars.map((car) => (
          <Card
            key={car.id}
            className={`overflow-hidden ${!car.available ? 'opacity-80' : ''}`}
          >
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
                    car.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {car.available ? 'Miễn phí sạc' : 'Hết xe'}
                </span>
              </div>
            </div>

            <CardContent className='p-4'>
              <div className='mb-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm text-gray-500'>Chỉ từ</span>
                  <span className='text-xl font-bold text-emerald-500'>
                    {car.price}{' '}
                    <span className='text-sm font-normal'>VNĐ/Ngày</span>
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
                  <span className='text-sm'>{car.range}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-gray-500'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                  </svg>
                  <span className='text-sm'>{car.seats} chỗ</span>
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
                      d='M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17A3 3 0 015 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z'
                      clipRule='evenodd'
                    />
                    <path d='M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z' />
                  </svg>
                  <span className='text-sm'>Dung tích cốp {car.trunk}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className='p-4 pt-0'>
              <Button
                variant={car.available ? 'default' : 'outline'}
                className={`w-full ${car.available ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-gray-500 border-gray-300'}`}
                disabled={!car.available}
              >
                {car.available ? 'Đặt xe ngay' : 'Hết xe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
