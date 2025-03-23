'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import * as React from 'react';

import DeleteDialog from '@/components/data-table/components/delete-dialog';
import EditVehicleDialog from '@/components/data-table/components/edit-vehicle-dialog';
import {
  DataTable,
  DataTableRowAction,
} from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

import vehicleService from '@/services/vehicle.service';
import { formatCurrencyFormat } from '@/utils/currency';

import { Vehicle } from '@/types/vehicle.type';

type RowActionType = 'edit' | 'delete';

interface VehicleRowAction extends DataTableRowAction<Vehicle> {
  type: RowActionType;
}

interface GetColumnsVehicleProps {
  setRowAction: React.Dispatch<React.SetStateAction<VehicleRowAction | null>>;
}

const getVehicleStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20';
    case 'rented':
      return 'inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20';
    case 'maintenance':
      return 'inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20';
    case 'unavailable':
    case 'expired':
      return 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20';
    default:
      return 'inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20';
  }
};

const getColumnsVehicle = ({
  setRowAction,
}: GetColumnsVehicleProps): ColumnDef<Vehicle>[] => [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[6px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'image',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Image' />
    ),
    cell: ({ row }) => {
      const imageUrl = row.getValue('image') as string;
      return (
        <div className='flex items-center'>
          <div className='h-12 w-12 relative overflow-hidden rounded-md'>
            <Image
              src={imageUrl || '/placeholder-vehicle.jpg'}
              alt={row.getValue('name') as string}
              fill
              className='object-cover'
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('name')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Brand' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('brand')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('type')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'license_plate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='License Plate' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('license_plate')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'price_per_day',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price (Day)' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {formatCurrencyFormat(row.getValue('price_per_day'))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <div className='flex w-[100px] items-center'>
          <span className={getVehicleStatusClass(status)}>{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actions' />
    ),
    cell: ({ row }) => (
      <DataTableRowActions
        getRowActionItems={() => (
          <>
            <DropdownMenuItem
              onSelect={() => setRowAction({ row, type: 'edit' })}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setRowAction({ row, type: 'delete' })}
            >
              Delete
            </DropdownMenuItem>
          </>
        )}
      />
    ),
  },
];

interface VehicleDataTableProps {
  data: Vehicle[];
  totalPages: number;
  refetch?: () => void;
  revalidateAction?: () => Promise<void>;
}

function VehicleDataTable({
  data,
  refetch,
  revalidateAction,
  totalPages,
}: VehicleDataTableProps) {
  const [rowAction, setRowAction] = React.useState<VehicleRowAction | null>(
    null,
  );

  return (
    <DataTable
      data={data}
      columns={getColumnsVehicle({ setRowAction })}
      pageCount={totalPages}
      getSearchChildren={(table) => (
        <Input
          placeholder='Filter vehicles...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table.getColumn('name')?.setFilterValue(event.target.value);
            table.setGlobalFilter(event.target.value);
          }}
          className='h-8 w-[150px] lg:w-[250px]'
        />
      )}
      getDeleteDialogChildren={(_table) => (
        <>
          {/* Delete Dialog */}
          <DeleteDialog
            onSuccess={async () => {
              // If refetch function is provided (client-side), use it
              if (refetch) {
                refetch();
              }
              // If revalidateAction is provided (server-side), use it
              if (revalidateAction) {
                await revalidateAction();
              }
            }}
            open={rowAction?.type === 'delete'}
            onOpenChange={() => setRowAction(null)}
            showTrigger={false}
            onActionDelete={async () => {
              if (rowAction?.row.original.id) {
                await vehicleService.deleteVehicle(rowAction.row.original.id);
              }
            }}
          />

          {/* Edit Vehicle Dialog */}
          {rowAction?.type === 'edit' && rowAction.row.original && (
            <EditVehicleDialog
              vehicle={rowAction.row.original}
              isOpen={rowAction.type === 'edit'}
              onClose={() => setRowAction(null)}
              onSuccess={async () => {
                // If refetch function is provided (client-side), use it
                if (refetch) {
                  refetch();
                }
                // If revalidateAction is provided (server-side), use it
                if (revalidateAction) {
                  await revalidateAction();
                }
              }}
            />
          )}
        </>
      )}
    />
  );
}

export default VehicleDataTable;
