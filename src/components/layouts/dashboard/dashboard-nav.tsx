'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

import { cn } from '@/lib/utils';

import { Icons } from '@/components/icons';

import { useAuth } from '@/contexts/auth-provider';

import { NavItem } from '@/types/nav.type';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

export function DashboardNav({ items, setOpen }: DashboardNavProps) {
  const path = usePathname();
  const { user } = useAuth();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className='grid items-start gap-2'>
      {items.map((item, index) => {
        const Icon = Icons[item.icon || 'arrowRight'];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (user?.role === 'ADMIN' && item.role === 'ADMIN') {
          return (
            item.href && (
              <Link
                key={index}
                href={item.disabled ? '/' : item.href}
                onClick={() => {
                  if (setOpen) setOpen(false);
                }}
              >
                <span
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                    path === item.href ? 'bg-accent' : 'transparent',
                    item.disabled && 'cursor-not-allowed opacity-80',
                  )}
                >
                  <Icon className='mr-2 h-4 w-4' />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          );
        }
      })}
    </nav>
  );
}
