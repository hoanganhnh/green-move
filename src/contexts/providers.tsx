'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';

import { Toaster } from '@/components/ui/toaster';

import { AuthProvider } from '@/contexts/auth-provider';

import { UserProfile } from '@/types/user.type';

export default function Providers({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: UserProfile;
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider user={user}>{children}</AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
