import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange?: (itemsPerPage: number) => void;
    rowsPerPageOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
    totalItems,
    currentPage,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    rowsPerPageOptions = [5, 10, 25, 50, 100],
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleItemsPerPageChange = (value: string) => {
        const newLimit = Number(value);
        onItemsPerPageChange?.(newLimit);
        onPageChange(1);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <div className="flex justify-between items-center px-4 py-2 text-sm">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                >
                    <SelectTrigger className="w-20">
                        <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        {rowsPerPageOptions.map((opt) => (
                            <SelectItem key={opt} value={opt.toString()}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Page navigation */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex space-x-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous page</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="h-8 w-8 p-0"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next page</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;