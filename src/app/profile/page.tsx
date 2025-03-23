'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import UpdateProfileForm from '@/components/forms/profile/update-profile-form';

import { useAuth } from '@/contexts/auth-provider';
import userService from '@/services/user.service';

import { UserProfile } from '@/types/user.type';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profileData, setProfileData] = React.useState<UserProfile | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Fetch the user profile data
    const fetchUserProfile = async () => {
      try {
        if (user?.id) {
          const userData = await userService.getUserById(user.id);
          setProfileData(userData);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, router, user]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className='container py-10'>
        <div className='mx-auto max-w-3xl text-center'>
          <p>Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container py-10'>
        <div className='mx-auto max-w-3xl'>
          <div
            className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative'
            role='alert'
          >
            <strong className='font-bold'>Error!</strong>
            <span className='block sm:inline'> {error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      <div className='mx-auto max-w-3xl'>
        {profileData ? (
          <UpdateProfileForm user={profileData} />
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </div>
  );
}
