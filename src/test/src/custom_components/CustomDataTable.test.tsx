import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomDataTable from '@/custom_components/CustomDataTable';
import { TrackingRow } from '@/utils/types';
import { ColumnDef } from '@tanstack/react-table';
import { mockData, localStorageMock } from '../__mocks__/mockData';

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



    it('expands a row when expander is clicked', async () => {
        const columnsWithExpander = () => [
            {
                id: 'expander',
                header: () => null,
                cell: ({ row }: { row: import('@tanstack/react-table').Row<TrackingRow> }) => (
                    <button
                        data-testid={`expand-button-${row.id}`}
                        onClick={() => row.toggleExpanded()}
                    >
                        {row.getIsExpanded() ? 'Collapse' : 'Expand'}
                    </button>
                ),
                size: 50,
            },
            ...mockColumns,
        ];

        render(
            <CustomDataTable
                {...defaultProps}
                columns={columnsWithExpander}
            />
        );

        expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();

        fireEvent.click(screen.getByTestId('expand-button-0'));

        expect(screen.getByTestId('expanded-content')).toBeInTheDocument();

        const expandedContent = screen.getByTestId('expanded-content');
        const patientName = within(expandedContent).getByText(/Name:/);

        expect(
            patientName.textContent?.includes('John Doe') ||
            patientName.textContent?.includes('Jane Smith') ||
            patientName.textContent?.includes('Robert Johnson')
        ).toBeTruthy();

        fireEvent.click(screen.getByTestId('expand-button-0'));

        expect(screen.queryByTestId('expanded-content')).not.toBeInTheDocument();
    });



    it('displays "No data available" when data is empty', () => {
        render(<CustomDataTable {...defaultProps} data={[]} />);

        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('toggles all rows expanded state', async () => {
        const columnsWithExpandToggle = (toggleAllExpanded: () => void, areAllRowsExpanded: boolean) => [
            {
                id: 'expander',
                header: () => (
                    <button
                        data-testid="toggle-all-expanded"
                        onClick={toggleAllExpanded}
                    >
                        {areAllRowsExpanded ? 'Collapse All' : 'Expand All'}
                    </button>
                ),
                cell: ({ row }: { row: import('@tanstack/react-table').Row<TrackingRow> }) => (
                    <button
                        data-testid={`expand-button-${row.id}`}
                        onClick={() => row.toggleExpanded()}
                    >
                        {row.getIsExpanded() ? 'Collapse' : 'Expand'}
                    </button>
                ),
                size: 50,
            },
            ...mockColumns,
        ];

        render(
            <CustomDataTable
                {...defaultProps}
                columns={(_toggleColumnMenu, toggleAllExpanded, areAllRowsExpanded) =>
                    columnsWithExpandToggle(toggleAllExpanded, areAllRowsExpanded)
                }
            />
        );

        expect(screen.queryAllByTestId('expanded-content').length).toBe(0);

        fireEvent.click(screen.getByTestId('toggle-all-expanded'));

        await waitFor(() => {
            expect(screen.getAllByTestId('expanded-content').length).toBe(3);
        });

        fireEvent.click(screen.getByTestId('toggle-all-expanded'));

        await waitFor(() => {
            expect(screen.queryAllByTestId('expanded-content')).toHaveLength(0);
        });
    });
});