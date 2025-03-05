import {
  BookOpen,
  Car,
  CrossIcon,
  LaptopMinimal,
  LayoutDashboardIcon,
  LucideIcon,
  Menu,
  User,
} from 'lucide-react';

export type Icon = LucideIcon;

export type IconProps = React.HTMLAttributes<SVGElement>;

import { FaFacebook } from 'react-icons/fa';

export const Icons = {
  logo: Car,
  menu: Menu,
  laptopMinimal: LaptopMinimal,
  bookOpen: BookOpen,
  facebook: FaFacebook,
  Cross2Icon: CrossIcon,
  dashboard: LayoutDashboardIcon,
  user: User,
};
