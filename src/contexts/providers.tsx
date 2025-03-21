'use client';

import * as React from 'react';

import { AuthProvider } from '@/contexts/auth-provider';

import { UserProfile } from '@/types/user.type';

export default function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: UserProfile;
}) {
  return <AuthProvider user={user}>{children}</AuthProvider>;
}
