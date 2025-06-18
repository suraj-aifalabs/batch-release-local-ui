import React from 'react';
import { render, screen } from '@testing-library/react';
import { CustomFileUploader } from '@/custom_components/CustomFileUploader';

describe('CustomFileUploader', () => {
    const mockSetFiles = jest.fn();
    const defaultDropZoneConfig = {
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxSize: 50 * 1024 * 1024, // 50MB
    };

    const defaultProps = {
        files: null,
        setFiles: mockSetFiles,
        dropZoneConfig: defaultDropZoneConfig,
        placeholder: ""
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with default placeholder', () => {
        render(<CustomFileUploader {...defaultProps} />);

        expect(screen.getByText(/or drag and drop/i)).toBeInTheDocument();
        expect(screen.getByText(/Supported format: .pdf, .docx \(Max: 50MB\)/i)).toBeInTheDocument();
    });

    it('renders custom placeholder when provided', () => {
        const customPlaceholder = 'Upload your documents here';
        render(<CustomFileUploader {...defaultProps} placeholder={customPlaceholder} />);

        expect(screen.getByText(customPlaceholder)).toBeInTheDocument();
    });

    it('displays uploaded files when files are provided', () => {
        const mockFiles = [
            new File(['content'], 'document.pdf', { type: 'application/pdf' }),
            new File(['content'], 'document.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
        ];

        render(<CustomFileUploader {...defaultProps} files={mockFiles} />);

        expect(screen.getByText('document.pdf')).toBeInTheDocument();
        expect(screen.getByText('document.docx')).toBeInTheDocument();
    });


    it('applies dropzone configuration correctly', () => {
        const customConfig = {
            ...defaultDropZoneConfig,
            maxFiles: 2,
        };

        render(<CustomFileUploader {...defaultProps} dropZoneConfig={customConfig} />);

    });

});