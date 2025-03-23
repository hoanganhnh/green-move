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
  DialogTrigger,
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

import { CreateVehicleDto } from '@/services/dtos/vehicle-dto.interface';
import vehicleService from '@/services/vehicle.service';

interface AddVehicleFormData {
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

const locationMap: Record<string, number> = {
  'Hà Nội': 1,
  'Hồ Chí Minh': 2,
};

interface AddVehicleDialogProps {
  onSuccess: () => void;
  trigger?: React.ReactNode;
}

export function AddVehicleDialog({
  onSuccess,
  trigger,
}: AddVehicleDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddVehicleFormData>({
    defaultValues: {
      name: '',
      brand: '',
      type: 'daily',
      license_plate: '',
      status: 'available',
      location_id: 1,
      price_per_day: 0,
      price_per_month: 0,
      price_per_year: 0,
      image: '',
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

  // Handle type change with Select component
  const handleTypeChange = (value: string) => {
    setValue('type', value as 'daily' | 'monthly' | 'yearly');
  };

  // Handle location change with Select component
  const handleLocationChange = (value: string) => {
    setValue('location_id', locationMap[value]);
  };

  const onSubmit = async (data: AddVehicleFormData) => {
    try {
      setIsSubmitting(true);

      const createData: CreateVehicleDto = {
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

      await vehicleService.createVehicle(createData);

      toast({
        title: 'Vehicle created',
        description: 'Vehicle has been created successfully',
      });

      reset();
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating vehicle:', error);
      toast({
        title: 'Error',
        description: 'Failed to create vehicle. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-[525px]'>
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter the details for the new vehicle. Click save when you're done.
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
              <Select onValueChange={handleTypeChange} defaultValue='daily'>
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
                defaultValue='Hà Nội'
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
                defaultValue='available'
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
              {isSubmitting ? 'Creating...' : 'Create Vehicle'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddVehicleDialog;
