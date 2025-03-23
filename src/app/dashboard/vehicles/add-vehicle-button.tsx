'use client';

import { Plus } from 'lucide-react';
import React from 'react';

import AddVehicleDialog from '@/components/data-table/components/add-vehicle-dialog';
import { Button } from '@/components/ui/button';

interface AddVehicleButtonProps {
  revalidateAction?: () => Promise<void>;
}

export default function AddVehicleButton({
  revalidateAction,
}: AddVehicleButtonProps) {
  return (
    <AddVehicleDialog
      onSuccess={async () => {
        if (revalidateAction) {
          await revalidateAction();
        }
      }}
      trigger={
        <Button className='flex items-center gap-2'>
          <Plus className='h-4 w-4' />
          Add Vehicle
        </Button>
      }
    />
  );
}
