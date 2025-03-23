'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UpdateVehicleDto } from '@/services/dtos/vehicle-dto.interface';
import vehicleService from '@/services/vehicle.service';

import { Vehicle } from '@/types/vehicle.type';

interface EditVehicleFormData {
  name: string;
  brand: string;
  type: string;
  license_plate: string;
  status: 'available' | 'unavailable' | 'maintenance' | 'rented' | 'expired';
  location_id: number;
  price_per_day: number;
  price_per_month: number;
  price_per_year: number;
  image: string;
}

interface EditVehicleDialogProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const locationMap: Record<string, number> = {
  'Hà Nội': 1,
  'Hồ Chí Minh': 2,
};

export function EditVehicleDialog({
  vehicle,
  isOpen,
  onClose,
  onSuccess,
}: EditVehicleDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditVehicleFormData>({
    defaultValues: {
      name: vehicle.name,
      brand: vehicle.brand,
      type: vehicle.type,
      license_plate: vehicle.license_plate,
      status: vehicle.status,
      location_id: vehicle.location_id,
      price_per_day: vehicle.price_per_day,
      price_per_month: vehicle.price_per_month,
      price_per_year: vehicle.price_per_year,
      image: vehicle.image,
    },
  });

  // Handle status change with Select component
  const handleStatusChange = (value: string) => {
    setValue(
      'status',
      value as
        | 'available'
        | 'unavailable'
        | 'maintenance'
        | 'rented'
        | 'expired',
    );
  };

  const handleTypeChange = (value: string) => {
    setValue('type', value as 'daily' | 'monthly' | 'yearly');
  };

  // Handle location change with Select component
  const handleLocationChange = (value: string) => {
    setValue('location_id', locationMap[value]);
  };

  const onSubmit = async (data: EditVehicleFormData) => {
    try {
      setIsSubmitting(true);

      const updateData: UpdateVehicleDto = {
        name: data.name,
        brand: data.brand,
        type: data.type,
        license_plate: data.license_plate,
        status: data.status,
        location_id: data.location_id,
        price_per_day: data.price_per_day,
        price_per_month: data.price_per_month,
        price_per_year: data.price_per_year,
        image: data.image,
      };

      await vehicleService.updateVehicle(vehicle.id, updateData);

      toast({
        title: 'Vehicle updated',
        description: 'Vehicle has been updated successfully',
      });

      onSuccess();
      onClose();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error updating vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vehicle. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Make changes to the vehicle details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                className='col-span-3'
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              {errors.name && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='brand' className='text-right'>
                Brand
              </Label>
              <Input
                id='brand'
                className='col-span-3'
                {...register('brand', {
                  required: 'Brand is required',
                })}
              />
              {errors.brand && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.brand.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='type' className='text-right'>
                Type
              </Label>
              <Select
                onValueChange={handleTypeChange}
                defaultValue={vehicle.type}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='daily'>Daily</SelectItem>
                  <SelectItem value='monthly'>Monthly</SelectItem>
                  <SelectItem value='yearly'>Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='location_id' className='text-right'>
                Location
              </Label>
              <Select
                onValueChange={handleLocationChange}
                defaultValue={
                  vehicle.location_id === 1 ? 'Hà Nội' : 'Hồ Chí Minh'
                }
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select location' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Hà Nội'>Hà Nội</SelectItem>
                  <SelectItem value='Hồ Chí Minh'>Hồ Chí Minh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='license_plate' className='text-right'>
                License Plate
              </Label>
              <Input
                id='license_plate'
                className='col-span-3'
                {...register('license_plate', {
                  required: 'License plate is required',
                })}
              />
              {errors.license_plate && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.license_plate.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price_per_day' className='text-right'>
                Price Per Day
              </Label>
              <Input
                id='price_per_day'
                type='number'
                step='0.01'
                className='col-span-3'
                {...register('price_per_day', {
                  required: 'Price per day is required',
                  min: { value: 0, message: 'Price must be positive' },
                })}
              />
              {errors.price_per_day && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.price_per_day.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price_per_month' className='text-right'>
                Price Per Month
              </Label>
              <Input
                id='price_per_month'
                type='number'
                step='0.01'
                className='col-span-3'
                {...register('price_per_month', {
                  required: 'Price per month is required',
                  min: { value: 0, message: 'Price must be positive' },
                })}
              />
              {errors.price_per_month && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.price_per_month.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='price_per_year' className='text-right'>
                Price Per Year
              </Label>
              <Input
                id='price_per_year'
                type='number'
                step='0.01'
                className='col-span-3'
                {...register('price_per_year', {
                  required: 'Price per year is required',
                  min: { value: 0, message: 'Price must be positive' },
                })}
              />
              {errors.price_per_year && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.price_per_year.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='image' className='text-right'>
                Image URL
              </Label>
              <Input
                id='image'
                className='col-span-3'
                {...register('image', {
                  required: 'Image URL is required',
                })}
              />
              {errors.image && (
                <p className='col-span-3 col-start-2 text-sm text-red-500'>
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='status' className='text-right'>
                Status
              </Label>
              <Select
                onValueChange={handleStatusChange}
                defaultValue={vehicle.status}
              >
                <SelectTrigger className='col-span-3'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='available'>Available</SelectItem>
                  <SelectItem value='unavailable'>Unavailable</SelectItem>
                  <SelectItem value='maintenance'>Maintenance</SelectItem>
                  <SelectItem value='rented'>Rented</SelectItem>
                  <SelectItem value='expired'>Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditVehicleDialog;
