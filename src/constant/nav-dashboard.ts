import { NavItem } from '@/types/nav.type';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard',
    role: 'ADMIN',
  },
  {
    title: 'Rentals',
    href: '/dashboard/rentals',
    icon: 'rental',
    label: 'Rentals',
    role: 'ADMIN',
  },
  {
    title: 'Payments',
    href: '/dashboard/payments',
    icon: 'payment',
    label: 'Payments',
    role: 'ADMIN',
  },
];
