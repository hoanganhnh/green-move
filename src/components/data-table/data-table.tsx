import {
  ColumnDef,
  flexRender,
  Row,
  Table as TableType,
} from '@tanstack/react-table';
import * as React from 'react';

import { useDataTable } from '@/hooks/use-data-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DataTableToolbar } from './data-table-toolbar';

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: 'delete' | 'edit';
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  getFilterChildren?: (table: TableType<TData>) => React.ReactNode;
  /**
   * @param table - Table instance
   * @returns - Action children
   * @description - This is used to render action button
   * @example
   * getActionToolbarChildren={(table) => (
   *  <div className='space-x-2'>
   *    <Button asChild size='sm'>
   *      <Link href='/admin/courses/create'>
   *        <Plus className='size-5' />Tạo mới
   *      </Link>
   *    </Button>
   *  </div>
   * )}
   */
  getActionToolbarChildren?: (table: TableType<TData>) => React.ReactNode;
  /**
   * @param table - Table instance
   * @returns - Search children
   * @description - This is used to render search input
   * @example
   * getSearchChildren={(table) => (
   *  <Input
   *    placeholder='Filter title...'
   *    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
   *    onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
   *    className='h-8 w-[150px] lg:w-[250px]'
   *  />
   * )}
   */
  getSearchChildren?: (table: TableType<TData>) => React.ReactNode;
  /**
   * @param table - Table instance
   * @returns - Delete dialog children
   * @description - This is used to render delete dialog
   * @example
   * getDeleteDialogChildren={(table) => (
   *  <DeleteDialog
   *    onSuccess={refetch}
   *    open={rowAction?.type === 'delete'}
   *    onOpenChange={() => setRowAction(null)}
   *    showTrigger={false}
   *    onActionDelete={async () => {
   *      if (rowAction?.row.original.id) {
   *      await onActionDelete?.()
   *    }
   *    }}
   *  />
   * )}
   */
  getDeleteDialogChildren?: (table: TableType<TData>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  getFilterChildren,
  getActionToolbarChildren,
  getSearchChildren,
  getDeleteDialogChildren,
}: DataTableProps<TData, TValue>) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
  });

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='space-y-4'>
        <DataTableToolbar
          table={table}
          filterChildren={getFilterChildren && getFilterChildren(table)}
          actionChildren={
            getActionToolbarChildren && getActionToolbarChildren(table)
          }
          searchChildren={getSearchChildren && getSearchChildren(table)}
        />
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className=''
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className='[&:has([role=checkbox])]:pr-4 [&>[role=checkbox]]:translate-y-[2px]'
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* <DataTablePagination table={table} /> */}
        {getDeleteDialogChildren && getDeleteDialogChildren(table)}
      </div>
    </div>
  );
}
