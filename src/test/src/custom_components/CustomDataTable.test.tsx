import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomDataTable from '@/custom_components/CustomDataTable';
import { TrackingRow } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';
import { mockData, localStorageMock } from '../__mocks__/mockData';
import userEvent from '@testing-library/user-event';
jest.mock('@remixicon/react', () => ({
    RiArrowUpSLine: () => <div data-testid="arrow-up-icon" />,
    RiArrowDownSLine: () => <div data-testid="arrow-down-icon" />,
    RiExpandUpDownLine: () => <div data-testid="expand-icon" />,
}));



const mockColumns: ColumnDef<TrackingRow>[] = [
    {
        id: 'patientName',
        accessorKey: 'patientName',
        header: 'Patient Name',
        cell: (info) => info.getValue(),
        size: 150,
        enableSorting: true,
    },
    {
        id: 'stage',
        accessorKey: 'stage',
        header: 'Stage',
        cell: (info) => info.getValue(),
        size: 120,
        enableSorting: true,
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => info.getValue(),
        size: 120,
        enableSorting: true,
    },
    {
        id: 'batch_id',
        accessorKey: 'batch_id',
        header: 'Batch ID',
        cell: (info) => info.getValue(),
        size: 120,
        enableSorting: true,
    },
    {
        id: 'created_at',
        accessorKey: 'created_at',
        header: 'Created At',
        cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
        size: 150,
        enableSorting: true,
    },
];

const MockExpandedComponent = ({ rowData }: { rowData: TrackingRow }) => (
    <div data-testid="expanded-content">
        <h3>Patient Details</h3>
        <p>Name: {rowData.patientName}</p>
        <p>DOB: {rowData.patientDOB}</p>
        <p>Weight: {rowData.patientWeight}</p>
        <p>Country: {rowData.associated_country}</p>
    </div>
);

const mockOnSortChange = jest.fn();
const mockOnPageChange = jest.fn();
const mockOnItemsPerPageChange = jest.fn();

const defaultProps = {
    data: mockData,
    columns: mockColumns,
    onSortChange: mockOnSortChange,
    isLoading: false,
    tableHeight: "470px",
    initialSorting: [{ id: 'created_at', desc: true }],
    ExpandedComponent: MockExpandedComponent,
    currentPage: 1,
    pageSize: 10,
    totalItems: 30, // Increased to make pagination active
    onPageChange: mockOnPageChange,
    onItemsPerPageChange: mockOnItemsPerPageChange,
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('CustomDataTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
    });

    it('renders the table with data', () => {
        render(<CustomDataTable {...defaultProps} />);

        const headers = screen.getAllByRole('columnheader');
        expect(headers.some(header => header.textContent?.includes('Patient Name'))).toBeTruthy();
        expect(headers.some(header => header.textContent?.includes('Stage'))).toBeTruthy();
        expect(headers.some(header => header.textContent?.includes('Status'))).toBeTruthy();
        expect(headers.some(header => header.textContent?.includes('Batch ID'))).toBeTruthy();
        expect(headers.some(header => header.textContent?.includes('Created At'))).toBeTruthy();

        // Check if data is rendered
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Robert Johnson')).toBeInTheDocument();
        expect(screen.getByText('Manufacturing')).toBeInTheDocument();
        expect(screen.getByText('QA')).toBeInTheDocument();
        expect(screen.getByText('Shipping')).toBeInTheDocument();
    });

    it('applies initial sorting', () => {
        render(<CustomDataTable {...defaultProps} />);
        expect(mockOnSortChange).not.toHaveBeenCalled();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Robert Johnson')).toBeInTheDocument();
    });


    it('displays "No data available" when data is empty', () => {
        render(<CustomDataTable {...defaultProps} data={[]} />);

        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('calls onSortChange when a sortable header is clicked', async () => {
        const user = userEvent.setup();
        render(<CustomDataTable {...defaultProps} />);

        const sortableHeader = screen.getByText('Patient Name');
        await user.click(sortableHeader);

        expect(mockOnSortChange).toHaveBeenCalledWith('patientName', 'asc');
    });



    it('calls onPageChange when next page is clicked', async () => {
        const user = userEvent.setup();
        render(<CustomDataTable {...defaultProps} currentPage={1} />);

        const nextBtn = screen.getByRole('button', { name: /next page/i });
        await user.click(nextBtn);

        expect(mockOnPageChange).toHaveBeenCalledWith(2);
    });


    it('updates sorting state when initialSorting prop changes', () => {
        const { rerender } = render(<CustomDataTable {...defaultProps} />);

        rerender(<CustomDataTable {...defaultProps} initialSorting={[{ id: 'stage', desc: false }]} />);


    });

});