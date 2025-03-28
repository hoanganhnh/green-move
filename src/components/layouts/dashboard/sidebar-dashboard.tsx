import { cn } from '@/lib/utils';

import { DashboardNav } from '@/components/layouts/dashboard/dashboard-nav';

import { navItems } from '@/constant/nav-dashboard';

export default function SidebarDashboard() {
  return (
    <nav
      className={cn(
        `relative hidden w-72 border-r pt-16 lg:block min-h-screen`,
      )}
    >
      <div className='space-y-4 py-4'>
        <div className='px-3 py-2'>
          <div className='space-y-1'>
            <h2 className='mb-2 px-4 text-xl font-semibold tracking-tight'>
              Overview
            </h2>
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
