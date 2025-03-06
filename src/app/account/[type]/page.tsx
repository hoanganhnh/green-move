'use client';

import { format } from 'date-fns';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function OrderHistory() {
  const [date, setDate] = React.useState<Date>();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className='container relative'>
      <SidebarProvider>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <div className='flex min-h-screen'>
          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='fixed bottom-4 right-4 z-50 p-2 bg-white rounded-md shadow-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
          >
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          </button>

          <Sidebar
            variant='sidebar'
            collapsible='offcanvas'
            className={`fixed md:relative border-r w-[280px] h-full top-0 left-0 bg-white z-40 transition-all duration-300 ease-in-out shadow-xl md:shadow-none md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <SidebarContent>
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className='absolute top-4 right-4 p-2 md:hidden hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
              <div className='py-6 px-6 mt-8 md:mt-0'>
                <h2 className='text-lg font-medium mb-6'>Tài khoản của tôi</h2>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href='#' className='text-base py-2 block w-full'>
                        My Account
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a
                        href='#'
                        className='text-base relative pl-4 py-2 block w-full before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-green-500'
                      >
                        My Orders
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href='#' className='text-base py-2 block w-full'>
                        Legal Terms and Conditions
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href='#' className='text-base py-2 block w-full'>
                        Change Password
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </SidebarContent>
          </Sidebar>
        </div>

        {/* Main Content */}
        <div className='flex-1 p-6 w-full md:w-auto'>
          <div className='max-w-[1160px] mx-auto'>
            <h1 className='text-2xl font-bold mb-6'>Lịch sử đơn hàng</h1>

            {/* Filter Section */}
            <div className='bg-white p-6 rounded-md shadow-sm mb-6'>
              <div className='flex items-center gap-2 mb-4'>
                <Filter className='h-5 w-5' />
                <h2 className='font-medium'>Bộ lọc tìm kiếm</h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {/* Order ID Search */}
                <div className='relative'>
                  <Input placeholder='Mã đơn hàng' className='pl-9' />
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                </div>

                {/* Car Model Dropdown */}
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Tất cả' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Tất cả</SelectItem>
                    <SelectItem value='vf3'>VinFast VF 3</SelectItem>
                    <SelectItem value='vf6-plus'>VinFast VF 6 Plus</SelectItem>
                    <SelectItem value='vf6s'>VinFast VF 6S</SelectItem>
                    <SelectItem value='vf7-plus'>VinFast VF 7 Plus</SelectItem>
                    <SelectItem value='vf7-eco'>VinFast VF 7 Eco</SelectItem>
                    <SelectItem value='vf8-eco'>VinFast VF 8 Eco</SelectItem>
                    <SelectItem value='vf8-plus'>VinFast VF 8 Plus</SelectItem>
                    <SelectItem value='vf9-plus'>VinFast VF 9 Plus</SelectItem>
                  </SelectContent>
                </Select>

                {/* Order Status Dropdown */}
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Tất cả' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='all'>Tất cả</SelectItem>
                    <SelectItem value='waiting'>Chờ xử lý</SelectItem>
                    <SelectItem value='awaiting-deposit'>
                      Chờ đặt cọc
                    </SelectItem>
                    <SelectItem value='confirmed'>Xác nhận</SelectItem>
                    <SelectItem value='in-use'>Đang sử dụng</SelectItem>
                    <SelectItem value='returned'>Đã trả xe</SelectItem>
                    <SelectItem value='overdue'>Quá hạn</SelectItem>
                    <SelectItem value='completed'>Hoàn thành</SelectItem>
                    <SelectItem value='cancelled'>Đã hủy</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Range Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      className='w-full justify-start text-left font-normal'
                    >
                      <Calendar className='mr-2 h-4 w-4' />
                      {date ? (
                        format(date, 'PPP')
                      ) : (
                        <span>Chọn khoảng thời gian</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <CalendarComponent
                      mode='single'
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Order Table */}
            <div className='bg-white rounded-md shadow-sm overflow-hidden'>
              <Table>
                <TableHeader className='bg-cyan-100'>
                  <TableRow>
                    <TableHead className='py-3'>Đơn hàng</TableHead>
                    <TableHead>Dòng xe</TableHead>
                    <TableHead>Thời gian nhận xe</TableHead>
                    <TableHead>Thời gian trả xe</TableHead>
                    <TableHead>Địa chỉ nhận xe</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>{/* Empty state - no rows */}</TableBody>
              </Table>

              {/* Pagination */}
              <div className='flex justify-end p-4 border-t'>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='icon' className='h-8 w-8'>
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button variant='outline' size='icon' className='h-8 w-8'>
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
