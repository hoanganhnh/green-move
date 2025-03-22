import Image from 'next/image';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import vehicleService from '@/services/vehicle.service';

import { Vehicle } from '@/types/vehicle.type';

async function getVehicle(id: number): Promise<Vehicle> {
  try {
    // Use the singleton instance of VehicleService
    const vehicle = await vehicleService.getVehicle(id);

    return vehicle;
  } catch (error) {
    // Error is already handled by throwing
    throw new Error('Failed to fetch vehicle data');
  }
}

// Server component to display vehicle details
export default async function VehicleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch vehicle data on the server
  let vehicle: Vehicle;

  try {
    vehicle = await getVehicle(Number(params.id));
  } catch (error) {
    // If vehicle not found or error occurs, show 404 page
    notFound();
  }
  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Car Image Gallery Section */}
        <div className='space-y-4'>
          <div className='relative h-[300px] md:h-[400px] rounded-lg overflow-hidden border'>
            <Image
              src={vehicle.image || '/placeholder.svg'}
              alt={vehicle.name}
              fill
              className='object-cover'
              priority
            />
          </div>
        </div>

        {/* Car Details Section */}
        <div className='space-y-6'>
          <div>
            <div className='flex items-center'>
              <h1 className='text-3xl font-bold'>{vehicle.name}</h1>
              <span
                className={`ml-2 ${vehicle.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} text-xs font-medium px-2 py-1 rounded`}
              >
                {vehicle.status === 'available' ? 'Có sẵn' : 'Hết xe'}
              </span>
            </div>
            <div className='mt-2'>
              <span className='text-2xl font-bold text-primary'>
                {vehicle.price_per_day.toLocaleString()} VND
              </span>
              <span className='text-gray-600'>/Ngày</span>
            </div>
            <p className='text-green-600 text-sm mt-1'>
              {vehicle.status === 'available' ? 'Miễn phí sạc' : 'Không có sẵn'}
            </p>
          </div>

          {/* Car Specifications */}
          <div className='grid grid-cols-2 gap-4 border rounded-lg p-4'>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z' />
                  <path d='M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
                </svg>
              </span>
              <div>
                <p className='text-sm font-medium'>{vehicle.brand}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                </svg>
              </span>
              <div>
                <p className='text-sm font-medium'>{vehicle.license_plate}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M5 9h14M5 15h14M5 5h14M5 19h14' />
                </svg>
              </span>
              <div>
                <p className='text-sm font-medium'>Số tự động</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='12' cy='12' r='10' />
                  <path d='M12 8v4l2 2' />
                </svg>
              </span>
              <div>
                <p className='text-sm font-medium'>7 túi khí</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z' />
                  <path d='M7 22V7H2.72a2 2 0 0 0-2 2.3l1.38 9a2 2 0 0 0 2 1.7H7z' />
                </svg>
              </span>
              <div>
                <p className='text-sm font-medium'>150 HP</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <rect x='2' y='6' width='20' height='12' rx='2' />
                  <path d='M2 12h20' />
                </svg>
              </span>
              <div>
                <p className='text-sm font-medium'>{vehicle.type}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M3 3h18v18H3z' />
                  <path d='M21 9H3M21 15H3M12 3v18' />
                </svg>
              </span>
              <div>
                <p className='text-sm font-medium'>423L</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='12' cy='12' r='10' />
                  <path d='M12 6v6l4 2' />
                </svg>
              </span>
              <div>
                <p className='text-sm font-medium'>
                  Giới hạn đi chuyển 300 km/ngày
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button className='flex-1 bg-green-500 hover:bg-green-600'>
              Đặt xe
            </Button>
            <Button variant='outline' className='flex-1'>
              Nhận thông tin tư vấn
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Features Section */}
      <div className='mt-12'>
        <h2 className='text-xl font-bold mb-4'>Các tính năng khác</h2>
        <div className='border rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex items-center gap-3'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5' />
                  <path d='M8.5 8.5v.01' />
                  <path d='M16 15.5v.01' />
                  <path d='M12 12v.01' />
                </svg>
              </span>
              <p className='text-sm'>Trợ lý ảo VinFast trí tuệ nhân tạo</p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
                  <path d='m9 12 2 2 4-4' />
                </svg>
              </span>
              <p className='text-sm'>Hệ thống hỗ trợ người lái ADAS nâng cao</p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M2 12h20M12 2v20' />
                </svg>
              </span>
              <p className='text-sm'>HUD tích hợp sẵn</p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='12' cy='12' r='10' />
                  <circle cx='12' cy='12' r='3' />
                </svg>
              </span>
              <p className='text-sm'>Camera 360 độ</p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <rect x='2' y='3' width='20' height='14' rx='2' />
                  <path d='M8 21h8' />
                  <path d='M12 17v4' />
                </svg>
              </span>
              <p className='text-sm'>Màn hình giải trí 12.9 inch</p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='text-gray-500'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <circle cx='12' cy='12' r='8' />
                  <circle cx='12' cy='12' r='2' />
                  <path d='M12 8v2' />
                  <path d='M12 14v2' />
                  <path d='M8 12H6' />
                  <path d='M16 12h2' />
                </svg>
              </span>
              <p className='text-sm'>La-zăng 19 inch</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Conditions Section */}
      <div className='mt-12'>
        <h2 className='text-xl font-bold mb-4'>Điều kiện thuê xe</h2>

        <div className='space-y-4'>
          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-2'>Thông tin cần có khi nhận xe</h3>
            <ul className='space-y-2'>
              <li className='flex items-start gap-2'>
                <span className='text-primary text-lg'>•</span>
                <span className='text-sm'>CCCD hoặc Hộ chiếu còn thời hạn</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary text-lg'>•</span>
                <span className='text-sm'>Bằng lái hợp lệ còn thời hạn</span>
              </li>
            </ul>
          </div>

          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-2'>Hình thức thanh toán</h3>
            <ul className='space-y-2'>
              <li className='flex items-start gap-2'>
                <span className='text-primary text-lg'>•</span>
                <span className='text-sm'>Trả trước</span>
              </li>
              <li className='flex items-start gap-2'>
                <span className='text-primary text-lg'>•</span>
                <span className='text-sm'>
                  Thời hạn thanh toán: đặt cọc giữ xe thanh toán 100% khi ký hợp
                  đồng và nhận xe
                </span>
              </li>
            </ul>
          </div>

          <div className='border rounded-lg p-4'>
            <h3 className='font-medium mb-2'>Chính sách đặt cọc (thế chấp)</h3>
            <ul className='space-y-2'>
              <li className='flex items-start gap-2'>
                <span className='text-primary text-lg'>•</span>
                <span className='text-sm'>
                  Khách hàng phải thanh toán 100% số tiền cọc 10.000.000đ tại
                  thời điểm đặt xe.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Similar Cars Section */}
      <div className='mt-12'>
        <h2 className='text-xl font-bold mb-4'>Xe tương tự</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <Card className='overflow-hidden'>
            <div className='relative h-48'>
              <Image
                src='/placeholder.svg'
                alt='VinFast VF 6S'
                fill
                className='object-cover'
              />
            </div>
            <CardContent className='p-4'>
              <h3 className='font-bold text-lg text-center'>VinFast VF 6S</h3>
              <p className='text-center text-green-600 font-medium mt-2'>
                1.050.000 VND/Ngày
              </p>
            </CardContent>
          </Card>

          <Card className='overflow-hidden'>
            <div className='relative h-48'>
              <Image
                src='/placeholder.svg'
                alt='VinFast VF 7S'
                fill
                className='object-cover'
              />
            </div>
            <CardContent className='p-4'>
              <h3 className='font-bold text-lg text-center'>VinFast VF 7S</h3>
              <p className='text-center text-green-600 font-medium mt-2'>
                1.450.000 VND/Ngày
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
