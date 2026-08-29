import React from "react";
import { PaginationFooter } from "@/components/admin/PaginationFooter";
import { CustomCheckbox } from "@/components/ui/CustomCheckbox";

export type ColumnDef<T> = {
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  width?: string;
  className?: string; // Additional classes for th/td
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T) => string;
  
  // Pagination
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  itemName?: string;
  pageSizes?: number[];

  // Selection
  selectedIds?: string[];
  onToggleSelectAll?: () => void;
  onToggleSelectRow?: (id: string) => void;

  // Actions
  onRowClick?: (row: T) => void;
  
  // Empty State
  emptyStateMessage?: string;
  colSpan?: number; // Total columns including checkbox and actions for empty state
};

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  totalCount = 0,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemName = "items",
  pageSizes = [5, 10, 20, 50, 250],
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onRowClick,
  emptyStateMessage = "No records found.",
  colSpan,
}: DataTableProps<T>) {
  const isSelectable = selectedIds !== undefined && onToggleSelectAll && onToggleSelectRow;
  const isPaginated = currentPage !== undefined && pageSize !== undefined && onPageChange && onPageSizeChange;
  
  const allSelected = isSelectable && data.length > 0 && selectedIds.length === data.length;
  const totalColumns = colSpan || (columns.length + (isSelectable ? 1 : 0));

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-2">
              {isSelectable && (
                <th className="pb-3.5 pl-1 pr-6 font-medium w-14">
                  <CustomCheckbox checked={!!allSelected} onChange={onToggleSelectAll} />
                </th>
              )}
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`pb-3.5 font-medium ${col.width || ""} ${col.headerClassName || ""} ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => {
                const id = keyExtractor(row);
                const isChecked = isSelectable ? selectedIds.includes(id) : false;
                
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-border/45 last:border-0 hover:bg-white/[0.01] transition ${onRowClick ? 'cursor-pointer' : ''} ${isChecked ? "bg-purple/5" : ""}`}
                  >
                    {isSelectable && (
                      <td className="py-3.5 pl-1 pr-6" onClick={(e) => e.stopPropagation()}>
                        <CustomCheckbox checked={isChecked} onChange={() => onToggleSelectRow(id)} />
                      </td>
                    )}
                    {columns.map((col, idx) => (
                      <td 
                        key={idx} 
                        className={`py-3.5 ${col.cellClassName || ""} ${col.className || ""}`}
                        onClick={idx === columns.length - 1 && col.header === 'Actions' ? (e) => e.stopPropagation() : undefined}
                      >
                        {col.cell(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={totalColumns} className="py-8 text-center text-muted-2">
                  {emptyStateMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPaginated && (
        <PaginationFooter
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={totalCount}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          itemName={itemName}
          pageSizes={pageSizes}
        />
      )}
    </div>
  );
}
