'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as React from 'react';

import DeleteDialog from '@/components/data-table/components/delete-dialog';
import EditRentalDialog from '@/components/data-table/components/edit-rental-dialog';
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

import rentalService from '@/services/rental.service';
import { formatCurrencyFormat } from '@/utils/currency';
import { getStatusClass } from '@/utils/rental-class';

import { Rental } from '@/types/rental.type';
import { UserProfile } from '@/types/user.type';
import { Vehicle } from '@/types/vehicle.type';

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
};

type RowActionType = 'edit' | 'delete';

interface RentalRowAction
  extends DataTableRowAction<Rental & { user: UserProfile; vehicle: Vehicle }> {
  type: RowActionType;
}

interface GetColumnsRentalProps {
  setRowAction: React.Dispatch<React.SetStateAction<RentalRowAction | null>>;
}

const getColumnsRental = ({
  setRowAction,
}: GetColumnsRentalProps): ColumnDef<
  Rental & { user: UserProfile; vehicle: Vehicle }
>[] => [
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
    accessorKey: 'pickup_location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pickup Location' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('pickup_location')}
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
          <span className={getStatusClass(status)}>{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'start_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Start Time' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{formatDate(row.getValue('start_time'))}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'end_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='End Time' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{formatDate(row.getValue('end_time'))}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'total_price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Price' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {formatCurrencyFormat(row.getValue('total_price'))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User' />
    ),
    cell: ({ row }) => {
      const user = row.getValue('user') as UserProfile;
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {user.fullName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'vehicle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vehicle' />
    ),
    cell: ({ row }) => {
      const vehicle = row.getValue('vehicle') as Vehicle;
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {vehicle.name} - {vehicle.type}
          </span>
        </div>
      );
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

interface RentalDataTableProps {
  data: Array<Rental & { user: UserProfile; vehicle: Vehicle }>;
  totalPages: number;
  refetch?: () => void;
  revalidateAction?: () => Promise<void>;
}

function RentalDataTable({
  data,
  refetch,
  revalidateAction,
  totalPages,
}: RentalDataTableProps) {
  const [rowAction, setRowAction] = React.useState<RentalRowAction | null>(
    null,
  );

  return (
    <DataTable
      data={data}
      columns={getColumnsRental({ setRowAction })}
      pageCount={totalPages}
      getSearchChildren={(table) => (
        <Input
          placeholder='Filter title...'
          value={
            (table.getColumn('pickup_location')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) => {
            table
              .getColumn('pickup_location')
              ?.setFilterValue(event.target.value);
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
                await rentalService.deleteRental(rowAction.row.original.id);
              }
            }}
          />

          {/* Edit Rental Dialog */}
          {rowAction?.type === 'edit' && rowAction.row.original && (
            <EditRentalDialog
              rental={rowAction.row.original}
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

export default RentalDataTable;
