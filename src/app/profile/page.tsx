'use client';

import * as React from 'react';

import UpdateProfileForm from '@/components/forms/profile/update-profile-form';

import { useAuth } from '@/contexts/auth-provider';

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-3xl'>
        {user ? (
          <UpdateProfileForm user={user} />
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </div>
  );
}
