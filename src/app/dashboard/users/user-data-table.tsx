'use client';

import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';

import DeleteDialog from '@/components/data-table/components/delete-dialog';
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

import EditUserDialog from '@/app/dashboard/users/edit-user-dialog';
import userService from '@/services/user.service';

import { UserProfile } from '@/types/user.type';

type RowActionType = 'edit' | 'delete';

interface UserRowAction extends DataTableRowAction<UserProfile> {
  type: RowActionType;
}

interface GetColumnsUserProps {
  setRowAction: React.Dispatch<React.SetStateAction<UserRowAction | null>>;
}

const getUserRoleBadgeClass = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20';
    case 'user':
      return 'inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20';
    default:
      return 'inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-600/20';
  }
};

const getColumnsUser = ({
  setRowAction,
}: GetColumnsUserProps): ColumnDef<UserProfile>[] => [
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
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Full Name' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('fullName')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('email')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone Number' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.getValue('phoneNumber')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Role' />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      return (
        <div className='flex w-[100px] items-center'>
          <span className={getUserRoleBadgeClass(role)}>{role}</span>
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

interface UserDataTableProps {
  data: UserProfile[];
  totalPages: number;
  refetch?: () => void;
  revalidateAction?: () => Promise<void>;
}

function UserDataTable({
  data,
  refetch,
  revalidateAction,
  totalPages,
}: UserDataTableProps) {
  const [rowAction, setRowAction] = React.useState<UserRowAction | null>(null);

  return (
    <DataTable
      data={data}
      columns={getColumnsUser({ setRowAction })}
      pageCount={totalPages}
      getSearchChildren={(table) => (
        <Input
          placeholder='Filter users...'
          value={
            (table.getColumn('fullName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) => {
            table.getColumn('fullName')?.setFilterValue(event.target.value);
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
                await userService.deleteUser(rowAction.row.original.id);
              }
            }}
          />

          {/* Edit User Dialog */}
          {rowAction?.type === 'edit' && rowAction.row.original && (
            <EditUserDialog
              user={rowAction.row.original}
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

export default UserDataTable;
