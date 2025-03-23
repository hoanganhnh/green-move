import { revalidatePath } from 'next/cache';
import * as React from 'react';

import AddVehicleButton from '@/app/dashboard/vehicles/add-vehicle-button';
import VehicleDataTable from '@/app/dashboard/vehicles/vehicle-data-table';
import vehicleService from '@/services/vehicle.service';

// Server action to revalidate the page after data changes
async function revalidateVehicles() {
  'use server';
  revalidatePath('/dashboard/vehicles');
}

async function VehicleDashboardPage() {
  const vehicles = await vehicleService.getVehicles();

  return (
    <div className='space-y-4'>
      <div className='flex justify-end items-center container mt-10'>
        <AddVehicleButton revalidateAction={revalidateVehicles} />
      </div>
      <VehicleDataTable
        data={vehicles}
        totalPages={1}
        revalidateAction={revalidateVehicles}
      />
    </div>
  );
}

export default VehicleDashboardPage;
