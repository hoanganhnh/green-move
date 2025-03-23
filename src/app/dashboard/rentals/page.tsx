import { revalidatePath } from 'next/cache';
import * as React from 'react';

import RentalDataTable from '@/app/dashboard/rentals/rental-data-table';
import rentalService from '@/services/rental.service';
import userService from '@/services/user.service';
import vehicleService from '@/services/vehicle.service';

// Server action to revalidate the page after data changes
async function revalidateRentals() {
  'use server';
  revalidatePath('/dashboard/rentals');
}

async function RentalsDashboardPage() {
  const rentals = await rentalService.getRentals();

  const rentalsWithUser = await Promise.all(
    rentals.map(async (r) => {
      const user = await userService.getUserById(r.user_id);
      const vehicle = await vehicleService.getVehicle(r.vehicle_id);
      return {
        ...r,
        user,
        vehicle,
      };
    }),
  );

  return (
    <div>
      <RentalDataTable
        data={rentalsWithUser}
        totalPages={1}
        revalidateAction={revalidateRentals}
      />
    </div>
  );
}

export default RentalsDashboardPage;
