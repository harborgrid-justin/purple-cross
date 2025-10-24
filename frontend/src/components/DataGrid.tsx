/**
 * DataGrid Component
 * A powerful data table component built on TanStack Table with WCAG 2.1 AA accessibility
 * Supports sorting, filtering, pagination, and column customization
 *
 * Accessibility Features:
 * - Full keyboard navigation (Arrow keys, Home/End, Page Up/Down)
 * - ARIA grid roles and properties
 * - Screen reader announcements
 * - Keyboard-accessible sorting
 */

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from '@tanstack/react-table';
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

export interface DataGridProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  pageSize?: number;
  className?: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onRowActivate?: (row: TData) => void;
  gridLabel?: string;
}

export function DataGrid<TData>({
  data,
  columns,
  pageSize = 10,
  className,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  loading = false,
  emptyMessage = 'No data available',
  onRowActivate,
  gridLabel = 'Data grid',
}: DataGridProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const rows = table.getRowModel().rows;
  const totalRows = rows.length;
  const totalCols = columns.length;

  // Announce screen reader messages
  const announce = (message: string): void => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = message;
    }
  };

  // Focus a specific cell
  const focusCell = (rowIndex: number, colIndex: number): void => {
    const validRowIndex = Math.max(0, Math.min(rowIndex, totalRows - 1));
    const validColIndex = Math.max(0, Math.min(colIndex, totalCols - 1));

    setFocusedCell({ rowIndex: validRowIndex, colIndex: validColIndex });

    // Focus the cell element
    const cellElement = tableRef.current?.querySelector(
      `[data-row-index="${validRowIndex}"][data-col-index="${validColIndex}"]`
    ) as HTMLElement;

    if (cellElement) {
      cellElement.focus();

      // Announce position to screen reader
      const rowNumber = validRowIndex + 1;
      const colNumber = validColIndex + 1;
      const columnHeader = table.getHeaderGroups()[0]?.headers[validColIndex];
      const columnName = columnHeader
        ? typeof columnHeader.column.columnDef.header === 'string'
          ? columnHeader.column.columnDef.header
          : `Column ${colNumber}`
        : `Column ${colNumber}`;

      announce(`Row ${rowNumber} of ${totalRows}, ${columnName}`);
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableElement>): void => {
    if (!focusedCell || totalRows === 0) return;

    const { rowIndex, colIndex } = focusedCell;
    let handled = false;

    switch (event.key) {
      case 'ArrowUp':
        if (rowIndex > 0) {
          focusCell(rowIndex - 1, colIndex);
          handled = true;
        }
        break;

      case 'ArrowDown':
        if (rowIndex < totalRows - 1) {
          focusCell(rowIndex + 1, colIndex);
          handled = true;
        }
        break;

      case 'ArrowLeft':
        if (colIndex > 0) {
          focusCell(rowIndex, colIndex - 1);
          handled = true;
        }
        break;

      case 'ArrowRight':
        if (colIndex < totalCols - 1) {
          focusCell(rowIndex, colIndex + 1);
          handled = true;
        }
        break;

      case 'Home':
        if (event.ctrlKey) {
          // Ctrl+Home: First cell of first row
          focusCell(0, 0);
        } else {
          // Home: First cell of current row
          focusCell(rowIndex, 0);
        }
        handled = true;
        break;

      case 'End':
        if (event.ctrlKey) {
          // Ctrl+End: Last cell of last row
          focusCell(totalRows - 1, totalCols - 1);
        } else {
          // End: Last cell of current row
          focusCell(rowIndex, totalCols - 1);
        }
        handled = true;
        break;

      case 'PageUp':
        if (enablePagination && table.getCanPreviousPage()) {
          table.previousPage();
          announce(`Page ${table.getState().pagination.pageIndex} of ${table.getPageCount()}`);
          handled = true;
        } else {
          // Jump up by 10 rows if no pagination
          focusCell(Math.max(0, rowIndex - 10), colIndex);
          handled = true;
        }
        break;

      case 'PageDown':
        if (enablePagination && table.getCanNextPage()) {
          table.nextPage();
          announce(`Page ${table.getState().pagination.pageIndex + 2} of ${table.getPageCount()}`);
          handled = true;
        } else {
          // Jump down by 10 rows if no pagination
          focusCell(Math.min(totalRows - 1, rowIndex + 10), colIndex);
          handled = true;
        }
        break;

      case 'Enter':
      case ' ':
        if (onRowActivate && rows[rowIndex]) {
          onRowActivate(rows[rowIndex].original);
          announce(`Row ${rowIndex + 1} activated`);
          handled = true;
        }
        break;
    }

    if (handled) {
      event.preventDefault();
    }
  };

  // Reset focused cell when data changes
  useEffect(() => {
    if (focusedCell && focusedCell.rowIndex >= totalRows) {
      setFocusedCell(null);
    }
  }, [totalRows, focusedCell]);

  return (
    <div className={clsx('data-grid', className)}>
      {/* Screen reader live region */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Global Filter */}
      {enableFiltering && (
        <div className="data-grid-filter">
          <label htmlFor="data-grid-search" className="sr-only">
            Search all columns
          </label>
          <input
            id="data-grid-search"
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search all columns..."
            className="data-grid-search"
            aria-label="Search all columns"
          />
        </div>
      )}

      {/* Table */}
      <div className="data-grid-table-wrapper">
        <table
          ref={tableRef}
          className="data-grid-table"
          role="grid"
          aria-label={gridLabel}
          aria-rowcount={totalRows + 1}
          aria-colcount={totalCols}
          onKeyDown={handleKeyDown}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} role="row" aria-rowindex={1}>
                {headerGroup.headers.map((header, colIndex) => {
                  const sortDirection = header.column.getIsSorted();
                  const canSort = header.column.getCanSort();

                  return (
                    <th
                      key={header.id}
                      className="data-grid-th"
                      role="columnheader"
                      aria-colindex={colIndex + 1}
                      aria-sort={
                        enableSorting && canSort
                          ? sortDirection === 'asc'
                            ? 'ascending'
                            : sortDirection === 'desc'
                              ? 'descending'
                              : 'none'
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <button
                          className={clsx('data-grid-header', {
                            'data-grid-header-sortable': canSort,
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e as unknown as React.MouseEvent);
                            }
                          }}
                          disabled={!canSort}
                          aria-label={
                            canSort
                              ? `${flexRender(header.column.columnDef.header, header.getContext())}. ${
                                  sortDirection === 'asc'
                                    ? 'Sorted ascending'
                                    : sortDirection === 'desc'
                                      ? 'Sorted descending'
                                      : 'Not sorted'
                                }. Click to ${sortDirection === 'asc' ? 'sort descending' : sortDirection === 'desc' ? 'clear sort' : 'sort ascending'}.`
                              : undefined
                          }
                          type="button"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {enableSorting && canSort && (
                            <span className="data-grid-sort-indicator" aria-hidden="true">
                              {sortDirection === 'asc' ? ' ▲' : ''}
                              {sortDirection === 'desc' ? ' ▼' : ''}
                              {!sortDirection ? ' ⇅' : ''}
                            </span>
                          )}
                        </button>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr role="row">
                <td
                  colSpan={columns.length}
                  className="data-grid-loading"
                  role="gridcell"
                  aria-colindex={1}
                >
                  <div className="spinner" />
                  <span>Loading...</span>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr role="row">
                <td
                  colSpan={columns.length}
                  className="data-grid-empty"
                  role="gridcell"
                  aria-colindex={1}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={row.id}
                  className="data-grid-row"
                  role="row"
                  aria-rowindex={rowIndex + 2}
                >
                  {row.getVisibleCells().map((cell, colIndex) => (
                    <td
                      key={cell.id}
                      className="data-grid-td"
                      role="gridcell"
                      aria-colindex={colIndex + 1}
                      tabIndex={
                        focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === colIndex
                          ? 0
                          : -1
                      }
                      data-row-index={rowIndex}
                      data-col-index={colIndex}
                      onFocus={() => setFocusedCell({ rowIndex, colIndex })}
                      onClick={() => {
                        setFocusedCell({ rowIndex, colIndex });
                        const cellElement = tableRef.current?.querySelector(
                          `[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`
                        ) as HTMLElement;
                        cellElement?.focus();
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && !loading && data.length > 0 && (
        <div className="data-grid-pagination" role="navigation" aria-label="Pagination">
          <div className="data-grid-pagination-info" aria-live="polite" aria-atomic="true">
            Showing{' '}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </div>

          <div className="data-grid-pagination-controls">
            <button
              className="data-grid-pagination-button"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to first page"
              type="button"
            >
              {'<<'}
            </button>
            <button
              className="data-grid-pagination-button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
              type="button"
            >
              {'<'}
            </button>
            <span className="data-grid-pagination-pages" aria-current="page">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <button
              className="data-grid-pagination-button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
              type="button"
            >
              {'>'}
            </button>
            <button
              className="data-grid-pagination-button"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Go to last page"
              type="button"
            >
              {'>>'}
            </button>
          </div>

          <div className="data-grid-pagination-size">
            <label htmlFor="page-size-select" className="sr-only">
              Results per page
            </label>
            <select
              id="page-size-select"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="data-grid-pagination-select"
              aria-label="Results per page"
            >
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
