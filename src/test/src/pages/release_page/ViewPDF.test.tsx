import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as apiService from '@/services/apiService';
import ViewPdf from '../../../../pages/release_page/ViewPdf';

jest.mock('@/services/apiService', () => ({
    getPDF: jest.fn(),
}));

describe('ViewPdf Component', () => {
    const mockBlob = new Blob(['dummy pdf content'], { type: 'application/pdf' });
    const mockBatchNumber = 'BATCH123';

    beforeEach(() => {
        (apiService.getPDF as jest.Mock).mockResolvedValue(mockBlob);
        global.URL.createObjectURL = jest.fn(() => 'blob:dummy-url');
        global.URL.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially and fetches PDF', async () => {
        render(<ViewPdf batchNumber={mockBatchNumber} />);
        expect(screen.getByText(/Loading document/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(apiService.getPDF).toHaveBeenCalledWith({
                batchNumber: mockBatchNumber,
                exception: false,
                sign: false
            });
            expect(screen.getByTitle('PDF Preview')).toBeInTheDocument();
        });
    });

    it('handles PDF fetch error', async () => {
        (apiService.getPDF as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));
        render(<ViewPdf batchNumber={mockBatchNumber} />);

        await waitFor(() => {
            expect(screen.getByText(/Loading document/i)).toBeInTheDocument();
        });
    });

    it('renders and toggles exception checkboxes', async () => {
        render(<ViewPdf batchNumber={mockBatchNumber} />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        const withExceptionCheckbox = screen.getByLabelText('Release with Exception');
        const noExceptionCheckbox = screen.getByLabelText('Release without Exception');

        // Initial state
        expect(noExceptionCheckbox).toBeChecked();
        expect(withExceptionCheckbox).not.toBeChecked();

        // Toggle checkboxes
        fireEvent.click(withExceptionCheckbox);
        expect(withExceptionCheckbox).toBeChecked();
        expect(noExceptionCheckbox).not.toBeChecked();

        await waitFor(() => {
            expect(apiService.getPDF).toHaveBeenCalledWith({
                batchNumber: mockBatchNumber,
                exception: true,
                sign: false
            });
        });

        fireEvent.click(noExceptionCheckbox);
        expect(noExceptionCheckbox).toBeChecked();
        expect(withExceptionCheckbox).not.toBeChecked();
    });

    it('handles signing process', async () => {
        render(<ViewPdf batchNumber={mockBatchNumber} />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        const signButton = screen.getByText('Sign');
        fireEvent.click(signButton);

        await waitFor(() => {
            expect(apiService.getPDF).toHaveBeenCalledWith({
                batchNumber: mockBatchNumber,
                exception: false,
                sign: true
            });
            expect(screen.queryByText('Sign')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('Release with Exception')).not.toBeInTheDocument();
        });
    });



    it('handles release functionality', async () => {
        const consoleSpy = jest.spyOn(console, 'log');

        render(<ViewPdf batchNumber={mockBatchNumber} />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        // Sign first to enable release
        fireEvent.click(screen.getByText('Sign'));
        await waitFor(() => screen.getByText('Release'));

        const releaseButton = screen.getByText('Release');
        fireEvent.click(releaseButton);

        expect(consoleSpy).toHaveBeenCalledWith('Document released');
        consoleSpy.mockRestore();
    });



    it('handles empty batch number', async () => {
        render(<ViewPdf batchNumber="" />);
        await waitFor(() => {
            expect(apiService.getPDF).toHaveBeenCalledWith({
                batchNumber: "",
                exception: false,
                sign: false
            });
        });
    });

    it('maintains loading state during operations', async () => {
        (apiService.getPDF as jest.Mock).mockImplementation(() => {
            return new Promise(resolve => setTimeout(() => resolve(mockBlob), 100));
        });

        render(<ViewPdf batchNumber={mockBatchNumber} />);

        // Initial loading
        expect(screen.getByText(/Loading document/i)).toBeInTheDocument();
        await waitFor(() => screen.getByTitle('PDF Preview'));

        // Sign loading
        fireEvent.click(screen.getByText('Sign'));
        expect(screen.getByText(/Loading document/i)).toBeInTheDocument();
        await waitFor(() => screen.getByText('Print'));
    });
});