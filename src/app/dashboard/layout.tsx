import type { Metadata } from 'next';
import * as React from 'react';

import HeaderDashboard from '@/components/layouts/dashboard/header-dashboard';
import SidebarDashboard from '@/components/layouts/dashboard/sidebar-dashboard';

export const metadata: Metadata = {
  title: 'Dashboard User',
  description: 'Dashboard',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <HeaderDashboard />
      <div className='flex'>
        <SidebarDashboard />
        <main className='w-full pt-16'>{children}</main>
      </div>
    </React.Fragment>
  );
}
