import type { Metadata } from 'next';

import RootLayout from '@/components/layouts/root-layout';

export const metadata: Metadata = {
  title: 'Profile - Green Move',
  description: 'Quản lý thông tin cá nhân của bạn',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}
