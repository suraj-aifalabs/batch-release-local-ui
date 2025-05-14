import React, { useState, useRef, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getExpandedRowModel,
    getSortedRowModel,
    flexRender,
    SortingState,
    ColumnDef,
    ExpandedState,
} from '@tanstack/react-table';
import { TrackingRow } from '@/utils/types';
import { RiArrowUpSLine, RiArrowDownSLine, RiExpandUpDownLine } from '@remixicon/react';
import Pagination from './Pagination';

type SortDirection = 'asc' | 'desc';

type CustomDataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    onSortChange?: (field: string, direction: SortDirection) => void;
    isLoading?: boolean;
    tableHeight?: string;
    initialSorting?: SortingState;
    ExpandedComponent?: React.ComponentType<{ rowData: T }>;
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (size: number) => void;
};

export const CustomDataTable = ({
    data,
    columns,
    onSortChange,
    tableHeight = "470px",
    initialSorting = [{ id: 'createdAt', desc: true }],
    ExpandedComponent,
    currentPage,
    pageSize,
    totalItems,
    onPageChange,
    onItemsPerPageChange

}: CustomDataTableProps<TrackingRow>) => {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const headerRef = useRef<HTMLDivElement>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setSorting(initialSorting);
    }, [initialSorting]);

    const handleSortingChange = (updatedSorting: SortingState) => {
        setSorting(updatedSorting);

        if (onSortChange && updatedSorting && updatedSorting.length > 0) {
            const column = updatedSorting[0].id;
            const direction = updatedSorting[0].desc ? 'desc' : 'asc';
            onSortChange(column, direction);
        } else if (onSortChange && (!updatedSorting || updatedSorting.length === 0)) {
            onSortChange('createdAt', 'desc');
        }
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            expanded,
            sorting,
        },
        onExpandedChange: setExpanded,
        onSortingChange: (updatedSorting) => {
            if (typeof updatedSorting === 'function') {
                const newSorting = updatedSorting(sorting);
                handleSortingChange(newSorting);
            } else {
                handleSortingChange(updatedSorting);
            }
        },
        getSubRows: () => undefined,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualSorting: true,
    });

    useEffect(() => {
        const bodyElement = bodyRef.current;
        if (!bodyElement) return;

        const handleScroll = () => {
            if (headerRef.current) {
                headerRef.current.scrollLeft = bodyElement.scrollLeft;
            }
        };

        bodyElement.addEventListener('scroll', handleScroll);
        return () => {
            bodyElement.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="w-full">
            <div className="bg-white rounded shadow">
                <div className="relative">
                    <div
                        ref={headerRef}
                        className="overflow-hidden bg-[#F1EFED] sticky top-0 z-10">
                        <table className="w-full table-fixed border-collapse">
                            <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="border-b text-xs text-gray-500 h-12">
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="px-3 py-2 text-center font-medium"
                                                style={{ width: header.column.getSize() }}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={`flex items-center justify-center gap-1 ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                                                            }`}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}

                                                        {header.column.getCanSort() && (
                                                            <div className="inline-flex flex-col">
                                                                {header.column.getIsSorted() === 'asc' ? (
                                                                    <RiArrowUpSLine className="text-blue-600 w-4 h-4" />
                                                                ) : header.column.getIsSorted() === 'desc' ? (
                                                                    <RiArrowDownSLine className="text-blue-600 w-4 h-4" />
                                                                ) : (
                                                                    <span className="text-gray-400">
                                                                        <RiExpandUpDownLine className="w-4 h-4" />
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                        </table>
                    </div>

                    <div
                        ref={bodyRef}
                        className="overflow-y-auto overflow-x-auto"
                        style={{ height: tableHeight }}
                    >
                        <table className="w-full table-fixed border-collapse">
                            <tbody className="divide-y divide-gray-200">
                                {table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map(row => (
                                        <React.Fragment key={row.id}>
                                            <tr className="hover:bg-gray-100 even:bg-[#F9F8F7] h-[60px] font-normal text-base">
                                                {row.getVisibleCells().map(cell => (
                                                    <td
                                                        key={cell.id}
                                                        className="px-3 py-2 text-center"
                                                        style={{ width: cell.column.getSize() }}
                                                    >
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </td>
                                                ))}
                                            </tr>
                                            {row.getIsExpanded() && (
                                                <tr key={`${row.id}-expanded`}>
                                                    <td colSpan={columns.length} className="bg-gray-50">
                                                        {ExpandedComponent && <ExpandedComponent rowData={row.original} />}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="text-center py-8 text-gray-500">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={currentPage}
                        itemsPerPage={pageSize}
                        totalItems={totalItems}
                        onPageChange={onPageChange}
                        onItemsPerPageChange={onItemsPerPageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default CustomDataTable;