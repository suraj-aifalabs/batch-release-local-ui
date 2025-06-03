import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FillAndPreviewPDF } from '@/pages/release_page/ViewPDF';
import * as apiService from '@/services/apiService';

jest.mock('@/services/apiService', () => ({
    getPDF: jest.fn(),
}));

describe('FillAndPreviewPDF', () => {
    const mockBlob = new Blob(['dummy pdf content'], { type: 'application/pdf' });

    beforeEach(() => {
        (apiService.getPDF as jest.Mock).mockResolvedValue(mockBlob);
    });

    it('renders loading state initially and fetches PDF', async () => {
        render(<FillAndPreviewPDF />);
        expect(screen.getByText(/Loading document/i)).toBeInTheDocument();

        await waitFor(() => {
            const iframe = screen.getByTitle('PDF Preview');
            expect(iframe).toBeInTheDocument();
        });
    });

    it('renders checkboxes and toggles state', async () => {
        render(<FillAndPreviewPDF />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        const withExceptionCheckbox = screen.getByLabelText('Release with Exception');
        const noExceptionCheckbox = screen.getByLabelText('Release without Exception');

        expect(withExceptionCheckbox).toBeInTheDocument();
        expect(noExceptionCheckbox).toBeInTheDocument();

        fireEvent.click(withExceptionCheckbox);
        fireEvent.click(noExceptionCheckbox);
    });

    it('calls getPDF with sign: true when signing', async () => {
        render(<FillAndPreviewPDF />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        const signButton = screen.getByText('Sign');
        fireEvent.click(signButton);

        await waitFor(() => {
            expect(apiService.getPDF).toHaveBeenLastCalledWith({
                exception: false,
                sign: true,
            });
        });

        expect(screen.getByText('Print')).toBeInTheDocument();
    });

    it('calls window.print() if geolocation allows', async () => {
        const mockPrint = jest.fn();
        const mockFocus = jest.fn();
        const mockWindow = {
            print: mockPrint,
            focus: mockFocus,
            onload: null as any,
        };

        global.URL.createObjectURL = jest.fn(() => 'blob:dummy-url');
        window.open = jest.fn(() => mockWindow as unknown as Window);
        // mock geolocation
        const getCurrentPositionMock = jest.fn((success: any) => {
            success(); // simulate geolocation success
        });

        // @ts-ignore
        global.navigator.geolocation = { getCurrentPosition: getCurrentPositionMock };

        render(<FillAndPreviewPDF />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        const signButton = screen.getByText('Sign');
        fireEvent.click(signButton);
        await waitFor(() => screen.getByText('Print'));

        const printButton = screen.getByText('Print');
        fireEvent.click(printButton);

        await waitFor(() => {
            mockWindow.onload();
            expect(mockPrint).toHaveBeenCalled();
            expect(mockFocus).toHaveBeenCalled();
        });
    });

    it('handles geolocation error on print', async () => {
        const errorMock = jest.fn();
        console.error = errorMock;

        const getCurrentPositionMock = jest.fn((_, error: any) => {
            error({ message: 'Permission denied' });
        });

        // @ts-ignore
        global.navigator.geolocation = { getCurrentPosition: getCurrentPositionMock };

        render(<FillAndPreviewPDF />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        const signButton = screen.getByText('Sign');
        fireEvent.click(signButton);
        await waitFor(() => screen.getByText('Print'));

        fireEvent.click(screen.getByText('Print'));
        await waitFor(() => {
            expect(errorMock).toHaveBeenCalledWith(
                'Geolocation error:',
                expect.objectContaining({ message: 'Permission denied' })
            );
        });
    });
});
