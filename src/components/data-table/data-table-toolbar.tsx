import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { DataTableViewOptions } from './data-table-view-options';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterChildren?: React.ReactNode;
  actionChildren?: React.ReactNode;
  searchChildren?: React.ReactNode;
}

export function DataTableToolbar<TData>({
  table,
  filterChildren,
  actionChildren,
  searchChildren,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    !!table.getState().globalFilter;

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {searchChildren}
        {filterChildren}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter('');
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X className='ml-2 size-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center justify-center gap-x-2'>
        <div className='text-sm text-gray-600'>
          Tổng số: {table.getFilteredRowModel().rows.length}
        </div>
        <DataTableViewOptions table={table} />
        {actionChildren}
      </div>
    </div>
  );
}
