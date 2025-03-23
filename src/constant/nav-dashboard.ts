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
    title: 'Users',
    href: '/dashboard/users',
    icon: 'user',
    label: 'Users',
    role: 'ADMIN',
  },
  {
    title: 'Vehicles',
    href: '/dashboard/vehicles',
    icon: 'vehicle',
    label: 'Vehicles',
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
