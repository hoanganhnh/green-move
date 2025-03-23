import { revalidatePath } from 'next/cache';
import * as React from 'react';

import AddUserButton from '@/app/dashboard/users/add-user-button';
import UserDataTable from '@/app/dashboard/users/user-data-table';
import userService from '@/services/user.service';

// Server action to revalidate the page after data changes
async function revalidateUsers() {
  'use server';
  revalidatePath('/dashboard/users');
}

async function UserDashboardPage() {
  const users = await userService.getUsers();

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center container mt-10'>
        <AddUserButton revalidateAction={revalidateUsers} />
      </div>
      <UserDataTable
        data={users.map((user) => ({
          ...user,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          role: user.role.roleName,
        }))}
        totalPages={1}
        revalidateAction={revalidateUsers}
      />
    </div>
  );
}

export default UserDashboardPage;
