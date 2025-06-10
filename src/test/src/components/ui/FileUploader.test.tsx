import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from '@/components/ui/FileUploader';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

// Mock react-dropzone
jest.mock('react-dropzone');
jest.mock('sonner');

describe('FileUploader', () => {
    const mockOnValueChange = jest.fn();
    const mockDropzoneState = {
        getRootProps: jest.fn().mockReturnValue({}),
        getInputProps: jest.fn().mockReturnValue({}),
        inputRef: { current: document.createElement('input') },
        isDragAccept: false,
        isDragReject: false,
    };

    beforeEach(() => {
        (useDropzone as jest.Mock).mockReturnValue(mockDropzoneState);
        jest.clearAllMocks();
    });

    const defaultProps = {
        value: null,
        onValueChange: mockOnValueChange,
        dropzoneOptions: {
            accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] },
            maxFiles: 1,
            maxSize: 1024 * 1024, // 1MB
        },
    };



    it('handles file drop', () => {
        const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
        const mockDropzoneOnDrop = jest.fn();

        (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
            mockDropzoneState.onDrop = onDrop;
            return mockDropzoneState;
        });

        render(
            <FileUploader {...defaultProps}>
                <FileUploaderContent>
                    <FileInput />
                </FileUploaderContent>
            </FileUploader>
        );

        act(() => {
            mockDropzoneState.onDrop([mockFile], []);
        });

        expect(mockOnValueChange).toHaveBeenCalledWith([mockFile]);
    });

    it('shows error toast when file is too large', () => {
        const mockRejectedFile = {
            file: new File(['content'], 'large.jpg', { type: 'image/jpeg' }),
            errors: [{ code: 'file-too-large', message: 'File is too large' }],
        };

        (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
            mockDropzoneState.onDrop = onDrop;
            return mockDropzoneState;
        });

        render(
            <FileUploader {...defaultProps}>
                <FileUploaderContent>
                    <FileInput />
                </FileUploaderContent>
            </FileUploader>
        );

        act(() => {
            mockDropzoneState.onDrop([], [mockRejectedFile]);
        });

        expect(toast.error).toHaveBeenCalledWith('File is too large. Max size is 1MB');
    });

});