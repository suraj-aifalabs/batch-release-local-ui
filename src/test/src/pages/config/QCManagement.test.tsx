import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import QCManagement from '@/pages/config/QCManagement';
import { uploadQCTemplate } from '@/services/apiService';

// Mock the dependencies
jest.mock('@/services/apiService');
jest.mock('@/custom_components/CustomFileUploader', () => ({
    CustomFileUploader: jest.fn(({ setFiles }) => {
        const mockFile = {
            name: 'test.pdf',
            size: 1024,
            type: 'application/pdf',
            slice: jest.fn(),
            arrayBuffer: jest.fn(),
            stream: jest.fn(),
            text: jest.fn(),
            lastModified: Date.now(),
        };

        return (
            <div
                data-testid="custom-file-uploader"
                onClick={() => setFiles([mockFile as unknown as File])}
            >
                Mock File Uploader
            </div>
        );
    })
}));

describe('QCManagement', () => {
    const mockUploadQCTemplate = uploadQCTemplate as jest.MockedFunction<typeof uploadQCTemplate>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockUploadQCTemplate.mockResolvedValue({ success: true });
    });

    it('renders correctly', () => {
        render(<QCManagement />);
        expect(screen.getByTestId('custom-file-uploader')).toBeInTheDocument();
        expect(screen.getByText('Mock File Uploader')).toBeInTheDocument();
    });

    it('calls uploadQCTemplate when files are selected', async () => {
        render(<QCManagement />);

        // Simulate file selection
        fireEvent.click(screen.getByTestId('custom-file-uploader'));

        await waitFor(() => {
            expect(mockUploadQCTemplate).toHaveBeenCalledTimes(1);
        });

        expect(mockUploadQCTemplate).toHaveBeenCalledWith(expect.any(FormData));
    });

});