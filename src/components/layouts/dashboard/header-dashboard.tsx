'use client';

import { Car } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import MobileSidebarDashboard from '@/components/layouts/dashboard/mobile-sidebar-dashboard';
import { UserAccountNav } from '@/components/layouts/nav/user-account-nav';

import { useAuth } from '@/contexts/auth-provider';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface HeaderDashboardProps {}

// eslint-disable-next-line no-empty-pattern
export default function HeaderDashboard({}: HeaderDashboardProps) {
  const { user } = useAuth();
  return (
    <div className='supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur'>
      <nav className='flex h-14 items-center justify-between px-4'>
        <div className='hidden lg:block'>
          <Link href='/'>
            <Car />
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebarDashboard />
        </div>
        <div className='flex items-center gap-2'>
          {user && <UserAccountNav user={user} />}
        </div>
      </nav>
    </div>
  );
}
