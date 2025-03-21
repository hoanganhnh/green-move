import { AvatarProps } from '@radix-ui/react-avatar';
import { User } from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { UserProfile } from '@/types/user.type';

interface UserAvatarProps extends AvatarProps {
  user: UserProfile;
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarImage
        alt={user?.username}
        src='/images/avatar.png'
        referrerPolicy='no-referrer'
        loading='lazy'
      />
      <AvatarFallback>
        <span className='sr-only'>{user?.username}</span>
        <User className='size-4' />
      </AvatarFallback>
    </Avatar>
  );
}
