'use client';

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import * as React from 'react';

import { cn } from '@/lib/utils';
import useMediaQuery from '@/hooks/use-media-query';

import { Icons } from '@/components/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { siteConfig } from '@/constant/config';
import { mainNavItems } from '@/constant/router';

import { MainNavItem } from '@/types/nav.type';

export default function MobileNavContent() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const segment = useSelectedLayoutSegment();
  const [open, setOpen] = React.useState(false);

  if (isDesktop) return null;

  const RecursiveAccordionItem = ({
    item,
    segment,
    setOpen,
    level = 0,
  }: {
    item: MainNavItem;
    segment: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    level?: number;
  }) => {
    const Icon = item.icon ? Icons[item.icon] : null;

    if (!item.items?.length) {
      return (
        <MobileLink
          href={item.htmlRef ? `/#${item.htmlRef}` : String(item.href)}
          segment={segment}
          setOpen={setOpen}
          disabled={item.disabled}
          className={cn(
            'flex w-full items-center py-2',
            level > 0 && 'pl-4',
            item.disabled && 'cursor-not-allowed opacity-60',
          )}
        >
          {Icon && <Icon className='mr-2 h-4 w-4 text-primary' />}
          <span className='text-sm'>{item.title}</span>
        </MobileLink>
      );
    }

    return (
      <AccordionItem value={item.title} className={cn(level > 0 && 'ml-4')}>
        <AccordionTrigger className='flex items-center py-6 text-sm'>
          <div className='flex gap-2'>
            {Icon && <Icon className='mr-2 h-4 w-4 text-primary' />}
            {item.title}
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className='flex flex-col space-y-2 pb-2'>
            {item.items.map((subItem, index) => (
              <RecursiveAccordionItem
                key={index}
                item={subItem}
                segment={segment}
                setOpen={setOpen}
                level={level + 1}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <div className='flex items-center justify-between w-full px-4 py-2 lg:hidden'>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='size-5 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden'
          >
            <Icons.menu aria-hidden='true' />
            <span className='sr-only'>Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left' className='pl-1 pr-0 pt-9'>
          <div className='w-full px-7'>
            <Link
              href='/'
              className='flex items-center'
              onClick={() => setOpen(false)}
            >
              <Icons.logo className='mr-2' aria-hidden='true' />
              <span className='font-bold'>{siteConfig.title}</span>
              <span className='sr-only'>Home</span>
            </Link>
          </div>
          <ScrollArea className='my-4 h-[calc(100vh-8rem)] pb-10 pl-6'>
            <div className='pl-1 pr-7'>
              <Accordion type='multiple' className='w-full'>
                {mainNavItems?.map((item, index) => {
                  if (item.htmlRef) {
                    return (
                      <Link
                        href={`/#${item.htmlRef}`}
                        key={index}
                        className='inline-block w-full border-b py-4 text-foreground'
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        <Button variant='link' className='p-0 text-foreground'>
                          {item.title}
                        </Button>
                      </Link>
                    );
                  }

                  return (
                    <RecursiveAccordionItem
                      key={index}
                      item={item}
                      segment={String(segment)}
                      setOpen={setOpen}
                    />
                  );
                })}
              </Accordion>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface MobileLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  disabled?: boolean;
  segment: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function MobileLink({
  children,
  href,
  disabled,
  segment,
  setOpen,
  className,
  ...props
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'text-foreground/70 transition-colors hover:text-foreground',
        href.includes(segment) && 'text-foreground',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </Link>
  );
}
