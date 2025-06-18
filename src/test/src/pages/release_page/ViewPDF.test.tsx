import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as apiService from '@/services/apiService';
import ViewPdf from '../../../../pages/release_page/ViewPdf';

jest.mock('@/services/apiService', () => ({
    getPDF: jest.fn(),
}));

describe('FillAndPreviewPDF', () => {
    const mockBlob = new Blob(['dummy pdf content'], { type: 'application/pdf' });

    beforeEach(() => {
        (apiService.getPDF as jest.Mock).mockResolvedValue(mockBlob);
    });

    it('renders loading state initially and fetches PDF', async () => {
        render(<ViewPdf />);
        expect(screen.getByText(/Loading document/i)).toBeInTheDocument();

        await waitFor(() => {
            const iframe = screen.getByTitle('PDF Preview');
            expect(iframe).toBeInTheDocument();
        });
    });

    it('renders checkboxes and toggles state', async () => {
        render(<ViewPdf />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        const withExceptionCheckbox = screen.getByLabelText('Release with Exception');
        const noExceptionCheckbox = screen.getByLabelText('Release without Exception');

        expect(withExceptionCheckbox).toBeInTheDocument();
        expect(noExceptionCheckbox).toBeInTheDocument();

        fireEvent.click(withExceptionCheckbox);
        fireEvent.click(noExceptionCheckbox);
    });


    it('calls window.print() if geolocation allows', async () => {
        const mockPrint = jest.fn();
        const mockFocus = jest.fn();
        const mockWindow = {
            print: mockPrint,
            focus: mockFocus,
            onload: null,
        };

        global.URL.createObjectURL = jest.fn(() => 'blob:dummy-url');
        window.open = jest.fn(() => mockWindow as unknown as Window);
        // mock geolocation
        const getCurrentPositionMock = jest.fn((success) => {
            success(); // simulate geolocation success
        });

        // @ts-expect-error this is ok to be here
        global.navigator.geolocation = { getCurrentPosition: getCurrentPositionMock };

        render(<ViewPdf />);
        await waitFor(() => screen.getByTitle('PDF Preview'));

        const signButton = screen.getByText('Sign');
        fireEvent.click(signButton);
        await waitFor(() => screen.getByText('Print'));

        const printButton = screen.getByText('Print');
        fireEvent.click(printButton);

    });

});
