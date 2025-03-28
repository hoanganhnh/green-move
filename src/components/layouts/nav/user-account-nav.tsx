import { CreditCard, LogOut, NotebookPen, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { UserAvatar } from '@/components/common/user-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAuth } from '@/contexts/auth-provider';

import { UserProfile } from '@/types/user.type';

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: UserProfile;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = React.useCallback(async (event: Event) => {
    event.preventDefault();
    try {
      logout();
    } catch (error) {
      // toast({
      //   variant: 'destructive',
      //   title: 'Uh oh! Something went wrong.',
      //   description: 'Error logout !',
      // })
    } finally {
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar user={user} className='size-8' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user?.fullName && <p className='font-medium'>{user?.fullName}</p>}
            {user?.email && (
              <p className='w-[200px] truncate text-sm text-muted-foreground'>
                {user?.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/billings' className='flex items-center space-x-2.5'>
            <CreditCard className='size-4' />
            <p className='text-sm'>Đơn hàng</p>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/profile' className='flex items-center space-x-2.5'>
            <User className='size-4' />
            <p className='text-sm'>Profile</p>
          </Link>
        </DropdownMenuItem>
        {user?.role === 'ADMIN' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/dashboard' className='flex items-center space-x-2.5'>
                <NotebookPen className='size-4' />
                <p className='text-sm'>Dashboard</p>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onSelect={handleLogout}>
          <div className='flex items-center space-x-2.5'>
            <LogOut className='size-4' />
            <p className='text-sm'>Log out</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
