'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as React from 'react';

import DeleteDialog from '@/components/data-table/components/delete-dialog';
import EditPaymentDialog from '@/components/data-table/components/edit-payment-dialog';
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

import paymentService from '@/services/payment.service';
import { formatCurrencyFormat } from '@/utils/currency';

import { Payment } from '@/types/payment.type';
import { Rental } from '@/types/rental.type';
import { UserProfile } from '@/types/user.type';

const formatDate = (dateString: string) => {
  return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
};

type RowActionType = 'edit' | 'delete';

interface PaymentRowAction
  extends DataTableRowAction<Payment & { user: UserProfile; rental: Rental }> {
  type: RowActionType;
}

interface GetColumnsPaymentProps {
  setRowAction: React.Dispatch<React.SetStateAction<PaymentRowAction | null>>;
}

const getColumnsPayment = ({
  setRowAction,
}: GetColumnsPaymentProps): ColumnDef<
  Payment & { user: UserProfile; rental: Rental }
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
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {formatCurrencyFormat(row.getValue('amount'))}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'payment_method',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Method' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('payment_method')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'payment_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Date' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{formatDate(row.getValue('payment_date'))}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const getPaymentStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
          case 'paid':
            return 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20';
          case 'pending':
            return 'inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-inset ring-yellow-600/20';
          case 'cancelled':
            return 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20';
          default:
            return 'inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20';
        }
      };
      return (
        <div className='flex w-[100px] items-center'>
          <span className={getPaymentStatusClass(status)}>{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
    accessorKey: 'rental',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rental ID' />
    ),
    cell: ({ row }) => {
      const rental = row.getValue('rental') as Rental;
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {rental.id}
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

interface PaymentDataTableProps {
  data: Array<Payment & { user: UserProfile; rental: Rental }>;
  totalPages: number;
  refetch?: () => void;
  revalidateAction?: () => Promise<void>;
}

function PaymentDataTable({
  data,
  refetch,
  revalidateAction,
  totalPages,
}: PaymentDataTableProps) {
  const [rowAction, setRowAction] = React.useState<PaymentRowAction | null>(
    null,
  );

  return (
    <DataTable
      data={data}
      columns={getColumnsPayment({ setRowAction })}
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
                await paymentService.deletePayment(rowAction.row.original.id);
              }
            }}
          />

          {/* Edit Rental Dialog */}
          {rowAction?.type === 'edit' && rowAction.row.original && (
            <EditPaymentDialog
              payment={rowAction.row.original}
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

export default PaymentDataTable;
