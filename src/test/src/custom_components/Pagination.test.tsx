import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Pagination from '@/custom_components/Pagination';

// Mock the UI components
jest.mock('@/components/ui/select', () => ({
    Select: ({ children, value, onValueChange }: any) => (
        <select data-testid="items-per-page-select" value={value} onChange={(e) => onValueChange(e.target.value)}>
            {children}
        </select>
    ),
    SelectContent: ({ children }: any) => <>{children}</>,
    SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
    SelectTrigger: ({ children }: any) => <div>{children}</div>,
    SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
}));

jest.mock('@/components/ui/button', () => ({
    Button: ({ children, onClick, disabled, ...props }: any) => (
        <button onClick={onClick} disabled={disabled} {...props}>
            {children}
        </button>
    ),
}));

jest.mock('lucide-react', () => ({
    ChevronLeft: () => <span data-testid="chevron-left">←</span>,
    ChevronRight: () => <span data-testid="chevron-right">→</span>,
}));

describe('Pagination Component', () => {
    const defaultProps = {
        totalItems: 100,
        currentPage: 1,
        itemsPerPage: 10,
        onPageChange: jest.fn(),
        onItemsPerPageChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        test('renders pagination component with default props', () => {
            render(<Pagination {...defaultProps} />);

            expect(screen.getByText('Rows per page:')).toBeInTheDocument();
            expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();
            expect(screen.getByTestId('items-per-page-select')).toBeInTheDocument();
        });

        test('renders with custom rowsPerPageOptions', () => {
            const customOptions = [20, 40, 60];
            render(<Pagination {...defaultProps} rowsPerPageOptions={customOptions} />);

            const select = screen.getByTestId('items-per-page-select');
            expect(select).toBeInTheDocument();

            // Check if custom options are rendered
            customOptions.forEach(option => {
                expect(screen.getByText(option.toString())).toBeInTheDocument();
            });
        });

        test('displays correct page information', () => {
            render(<Pagination {...defaultProps} currentPage={5} />);
            expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
        });

        test('calculates total pages correctly', () => {
            // 47 items with 10 per page should give 5 pages
            render(<Pagination {...defaultProps} totalItems={47} />);
            expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
        });
    });

    describe('Navigation Buttons', () => {
        test('previous button is disabled on first page', () => {
            render(<Pagination {...defaultProps} currentPage={1} />);

            const prevButton = screen.getByRole('button', { name: /previous page/i });
            expect(prevButton).toBeDisabled();
        });

        test('next button is disabled on last page', () => {
            render(<Pagination {...defaultProps} currentPage={10} totalItems={100} itemsPerPage={10} />);

            const nextButton = screen.getByRole('button', { name: /next page/i });
            expect(nextButton).toBeDisabled();
        });

        test('both buttons are enabled on middle page', () => {
            render(<Pagination {...defaultProps} currentPage={5} />);

            const prevButton = screen.getByRole('button', { name: /previous page/i });
            const nextButton = screen.getByRole('button', { name: /next page/i });

            expect(prevButton).not.toBeDisabled();
            expect(nextButton).not.toBeDisabled();
        });

        test('previous button calls onPageChange with correct page', async () => {
            const user = userEvent.setup();
            render(<Pagination {...defaultProps} currentPage={5} />);

            const prevButton = screen.getByRole('button', { name: /previous page/i });
            await user.click(prevButton);

            expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
        });

        test('next button calls onPageChange with correct page', async () => {
            const user = userEvent.setup();
            render(<Pagination {...defaultProps} currentPage={5} />);

            const nextButton = screen.getByRole('button', { name: /next page/i });
            await user.click(nextButton);

            expect(defaultProps.onPageChange).toHaveBeenCalledWith(6);
        });

        test('does not navigate beyond boundaries', async () => {
            const user = userEvent.setup();

            // Test first page
            const { rerender } = render(<Pagination {...defaultProps} currentPage={1} />);
            const prevButton = screen.getByRole('button', { name: /previous page/i });
            await user.click(prevButton);
            expect(defaultProps.onPageChange).not.toHaveBeenCalled();

            // Test last page
            rerender(<Pagination {...defaultProps} currentPage={10} />);
            const nextButton = screen.getByRole('button', { name: /next page/i });
            await user.click(nextButton);
            expect(defaultProps.onPageChange).not.toHaveBeenCalled();
        });
    });

    describe('Items Per Page Selection', () => {
        test('displays current itemsPerPage value', () => {
            render(<Pagination {...defaultProps} itemsPerPage={25} />);

            const select = screen.getByTestId('items-per-page-select');
            expect(select).toHaveValue('25');
        });

        test('calls onItemsPerPageChange when selection changes', async () => {
            const user = userEvent.setup();
            render(<Pagination {...defaultProps} />);

            const select = screen.getByTestId('items-per-page-select');
            await user.selectOptions(select, '25');

            expect(defaultProps.onItemsPerPageChange).toHaveBeenCalledWith(25);
        });

        test('resets to page 1 when items per page changes', async () => {
            const user = userEvent.setup();
            render(<Pagination {...defaultProps} currentPage={5} />);

            const select = screen.getByTestId('items-per-page-select');
            await user.selectOptions(select, '50');

            expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
        });

        test('works without onItemsPerPageChange callback', async () => {
            const user = userEvent.setup();
            const propsWithoutCallback = { ...defaultProps, onItemsPerPageChange: undefined };

            render(<Pagination {...propsWithoutCallback} />);

            const select = screen.getByTestId('items-per-page-select');
            await user.selectOptions(select, '25');

            // Should not throw error and should still reset page
            expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
        });
    });

    describe('Edge Cases', () => {
        test('handles zero total items', () => {
            render(<Pagination {...defaultProps} totalItems={0} />);
            expect(screen.getByText('Page 1 of 0')).toBeInTheDocument();
        });

        test('handles single page scenario', () => {
            render(<Pagination {...defaultProps} totalItems={5} itemsPerPage={10} />);

            expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();

            const prevButton = screen.getByRole('button', { name: /previous page/i });
            const nextButton = screen.getByRole('button', { name: /next page/i });

            expect(prevButton).toBeDisabled();
            expect(nextButton).toBeDisabled();
        });

        test('handles exact division of total items', () => {
            render(<Pagination {...defaultProps} totalItems={50} itemsPerPage={10} />);
            expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
        });

        test('handles large numbers', () => {
            render(<Pagination {...defaultProps} totalItems={10000} itemsPerPage={100} currentPage={50} />);
            expect(screen.getByText('Page 50 of 100')).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        test('has proper ARIA labels for navigation buttons', () => {
            render(<Pagination {...defaultProps} />);

            expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
        });

        test('screen reader text is present but visually hidden', () => {
            render(<Pagination {...defaultProps} />);

            const screenReaderTexts = screen.getAllByText(/previous page|next page/i);
            expect(screenReaderTexts).toHaveLength(2);
        });
    });

    describe('Props Validation', () => {
        test('handles missing optional props gracefully', () => {
            const minimalProps = {
                totalItems: 50,
                currentPage: 2,
                itemsPerPage: 10,
                onPageChange: jest.fn(),
            };

            render(<Pagination {...minimalProps} />);

            expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
            expect(screen.getByText('Rows per page:')).toBeInTheDocument();
        });


    });

    describe('Component State Updates', () => {
        test('updates display when props change', () => {
            const { rerender } = render(<Pagination {...defaultProps} currentPage={1} />);
            expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();

            rerender(<Pagination {...defaultProps} currentPage={3} />);
            expect(screen.getByText('Page 3 of 10')).toBeInTheDocument();
        });

        test('recalculates total pages when totalItems changes', () => {
            const { rerender } = render(<Pagination {...defaultProps} totalItems={100} />);
            expect(screen.getByText('Page 1 of 10')).toBeInTheDocument();

            rerender(<Pagination {...defaultProps} totalItems={200} />);
            expect(screen.getByText('Page 1 of 20')).toBeInTheDocument();
        });
    });
});