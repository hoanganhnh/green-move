import type { Metadata } from 'next';

import RootLayout from '@/components/layouts/root-layout';

export const metadata: Metadata = {
  title: 'Thanh toán - Green Move',
  description: 'Quản lý thanh toán và lịch sử giao dịch của bạn',
};

export default function BillingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
