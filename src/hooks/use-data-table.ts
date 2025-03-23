import {
  type ColumnFiltersState,
  type SortingState,
  type TableOptions,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import * as React from 'react';

interface UseDataTableProps<TData>
  extends Omit<
      TableOptions<TData>,
      | 'state'
      | 'pageCount'
      | 'getCoreRowModel'
      | 'manualFiltering'
      | 'manualPagination'
      | 'manualSorting'
    >,
    Required<Pick<TableOptions<TData>, 'pageCount'>> {}

export function useDataTable<TData>({ ...props }: UseDataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = useQueryStates(
    {
      page: parseAsInteger.withDefault(
        props.initialState?.pagination?.pageIndex ?? 1,
      ),
      perPage: parseAsInteger.withDefault(
        props.initialState?.pagination?.pageSize ?? 10,
      ),
    },
    {
      history: 'push',
    },
  );
  const [search, setSearch] = useQueryStates({
    search: parseAsString.withDefault(''),
  });

  const paginationState = React.useMemo(
    () => ({
      pageIndex: pagination.page - 1,
      pageSize: pagination.perPage,
    }),
    [pagination.page, pagination.perPage],
  );

  const table = useReactTable({
    ...props,
    state: {
      sorting,
      columnFilters,
      pagination: paginationState,
      globalFilter: search.search,
    },
    onSortingChange: setSorting,
    onPaginationChange: (updaterOrValue) => {
      const newState =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(paginationState)
          : updaterOrValue;

      // Ensure we don't set page to 0 or negative values
      setPagination({
        page: Math.max(1, newState.pageIndex + 1),
        perPage: newState.pageSize,
      });
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: (value) => {
      setSearch({ search: value?.trim() ?? '' });

      if (value) {
        setPagination({ page: 1, perPage: pagination.perPage });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
  });

  return {
    table,
    search: search.search,
    setSearch: (value: string) => setSearch({ search: value }),
  };
}
