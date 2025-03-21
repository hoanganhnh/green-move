'use client';

import Link from 'next/link';
import * as React from 'react';

import useScroll from '@/hooks/use-scroll';

import MainNavContent from '@/components/layouts/nav/main-nav-content';
import MobileNavContent from '@/components/layouts/nav/mobile-nav-content';
import { UserAccountNav } from '@/components/layouts/nav/user-account-nav';
import { Button } from '@/components/ui/button';

import { mainNavItems } from '@/constant/router';
import { useAuth } from '@/contexts/auth-provider';

interface NavBarProps {
  children?: React.ReactNode;
  rightElements?: React.ReactNode;
  scroll?: boolean;
}

function RightNavContent() {
  const { user } = useAuth();
  if (user)
    return (
      <div className='flex gap-6'>
        <UserAccountNav user={user} />
      </div>
    );
  return <DefaultNavRightContent />;
}

function DefaultNavRightContent() {
  return (
    <div className='ml-auto flex gap-2'>
      <Button
        asChild
        size='lg'
        className='text-base px-0 sm:px-4'
        variant='link'
      >
        <Link href='/sign-in'>Login</Link>
      </Button>
    </div>
  );
}

function NavBar({ scroll, children, rightElements }: NavBarProps) {
  const scrolled = useScroll(64);

  return (
    <header
      className={`fixed top-0 z-50 flex w-full justify-center bg-background/60 backdrop-blur-xl transition-all sm:sticky ${
        scroll ? (scrolled ? 'border-b' : 'bg-background/0') : 'border-b'
      }`}
    >
      <div className='container flex h-20 items-center justify-between py-4'>
        <MainNavContent items={mainNavItems}>{children}</MainNavContent>
        <MobileNavContent />
        <div className='flex items-center gap-4'>
          {rightElements}
          <RightNavContent />
        </div>
      </div>
    </header>
  );
}

export default NavBar;
