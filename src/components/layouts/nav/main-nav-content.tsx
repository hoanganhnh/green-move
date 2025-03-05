'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Icons } from '@/components/icons';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { MainNavItem } from '@/types/nav.type';

const DEFAULT_WIDTH_NAV = 460;

interface MainNavProps {
  items: MainNavItem[];
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'> & {
    icon?: keyof typeof Icons;
    isNested?: boolean;
  }
>(({ className, title, children, href, icon, isNested, ...props }, ref) => {
  const Icon = icon ? Icons[icon] : null;
  return (
    <li className={cn('w-full', isNested ? 'pl-4' : '')}>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          href={String(href)}
          className={cn(
            'flex w-full select-none items-center rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className='flex w-full items-center gap-3'>
            {Icon && <Icon className='h-5 w-5 text-primary flex-shrink-0' />}
            <div className='flex flex-col gap-1'>
              <div className='text-sm font-medium leading-none'>{title}</div>
              {children && (
                <p className='text-sm text-muted-foreground line-clamp-1'>
                  {children}
                </p>
              )}
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

const SubMenu = ({
  items,
  level = 0,
}: {
  items: MainNavItem[];
  level?: number;
}) => {
  return (
    <ul
      className={cn(
        'grid w-full gap-1.5',
        level === 1 ? 'grid-cols-2' : 'grid-cols-1',
      )}
    >
      {items.map((item) => {
        const Icon = item.icon ? Icons[item.icon] : null;

        return (
          <React.Fragment key={item.title}>
            {item.items?.length ? (
              <li className='col-span-full'>
                <div className='mb-2 mt-4 text-sm font-medium first:mt-0 flex gap-2'>
                  {Icon && (
                    <Icon className='h-5 w-5 text-primary flex-shrink-0' />
                  )}
                  <span className='text-accent-foreground'>{item.title}</span>
                </div>
                <SubMenu items={item.items} level={level + 1} />
              </li>
            ) : (
              <ListItem
                title={item.title}
                href={item.href}
                icon={item.icon}
                isNested={level > 0}
                className='text-muted-foreground'
              >
                {item.description}
              </ListItem>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
};

function MainNav({ items }: MainNavProps) {
  const router = useRouter();

  const handleNavigation = (event: React.MouseEvent, item: MainNavItem) => {
    if (item.htmlRef) {
      event.preventDefault();
      const sectionId = item.htmlRef;
      router.push(`/#${sectionId}`, undefined);
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className='gap-2'>
        {items.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.items?.length ? (
              <>
                <NavigationMenuTrigger className='h-auto bg-transparent text-base'>
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div
                    className={`w-[${item.width || DEFAULT_WIDTH_NAV}px] p-4`}
                  >
                    <SubMenu items={item.items} level={0} />
                  </div>
                </NavigationMenuContent>
              </>
            ) : item.htmlRef ? (
              <Link
                href={`/#${item.htmlRef}`}
                onClick={(e) => handleNavigation(e, item)}
                className={cn(
                  navigationMenuTriggerStyle(),
                  'h-auto bg-transparent text-base',
                )}
              >
                {item.title}
              </Link>
            ) : (
              <Link
                href={item.href || ''}
                className={cn(
                  navigationMenuTriggerStyle(),
                  'h-auto bg-transparent text-base',
                )}
              >
                {item.title}
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface MainNavContentProps {
  items: MainNavItem[];
  children?: React.ReactNode;
}

export default function MainNavContent({
  items,
  children,
}: MainNavContentProps) {
  return (
    <div className='hidden gap-6 md:gap-10 lg:flex'>
      <Link
        href='/'
        className='hidden items-center space-x-2 md:flex'
        aria-label='Go to Home page'
      >
        <Icons.logo />
      </Link>
      <MainNav items={items} />
      {children}
    </div>
  );
}
