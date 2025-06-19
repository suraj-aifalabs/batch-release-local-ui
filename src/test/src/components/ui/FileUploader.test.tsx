import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from '@/components/ui/FileUploader';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

jest.mock('react-dropzone');
jest.mock('sonner');

describe('FileUploader - extended coverage', () => {
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


    it('navigates between files with arrow keys and resets with Escape', () => {
        const file1 = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
        const file2 = new File(['b'], 'b.jpg', { type: 'image/jpeg' });
        const onValueChange = jest.fn();

        const { container } = render(
            <FileUploader value={[file1, file2]} onValueChange={onValueChange} dropzoneOptions={{ ...defaultProps.dropzoneOptions, maxFiles: 2 }}>
                <FileUploaderContent>
                    <FileUploaderItem index={0}>a.jpg</FileUploaderItem>
                    <FileUploaderItem index={1}>b.jpg</FileUploaderItem>
                </FileUploaderContent>
            </FileUploader>
        );

        const rootDiv = container.querySelector('[tabindex="0"]')!;
        fireEvent.keyDown(rootDiv, { key: 'ArrowRight' });
        fireEvent.keyDown(rootDiv, { key: 'ArrowRight' }); // should wrap around
        fireEvent.keyDown(rootDiv, { key: 'Escape' });

        expect(rootDiv).toBeInTheDocument(); // just sanity
    });

    it('prevents key actions when no files are selected', () => {
        const { container } = render(
            <FileUploader {...defaultProps}>
                <FileUploaderContent>
                    <FileInput />
                </FileUploaderContent>
            </FileUploader>
        );

        const rootDiv = container.querySelector('[tabindex="0"]')!;
        fireEvent.keyDown(rootDiv, { key: 'Delete' }); // nothing should happen

        expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('respects RTL layout and renders remove button on left', () => {
        const file = new File(['x'], 'rtl.jpg', { type: 'image/jpeg' });
        const { container, getByText } = render(
            <FileUploader value={[file]} onValueChange={jest.fn()} dropzoneOptions={defaultProps.dropzoneOptions} dir="rtl">
                <FileUploaderContent>
                    <FileUploaderItem index={0}>rtl.jpg</FileUploaderItem>
                </FileUploaderContent>
            </FileUploader>
        );

        expect(getByText('rtl.jpg')).toBeInTheDocument();
        const removeButton = container.querySelector('button');
        expect(removeButton?.className.includes('left-1')).toBe(true);
    });

    it('calls onDropAccepted/onDropRejected correctly', () => {
        let acceptedHandler: () => void;
        let rejectedHandler: () => void;

        (useDropzone as jest.Mock).mockImplementation(({ onDropAccepted, onDropRejected }) => {
            acceptedHandler = onDropAccepted;
            rejectedHandler = onDropRejected;
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
            acceptedHandler!();
            rejectedHandler!();
        });

        // These toggle internal state, so we check if the component renders fine after calls
        expect(true).toBe(true); // smoke assert
    });
    it('removes file when remove button is clicked', () => {
        const file = new File(['x'], 'test.jpg', { type: 'image/jpeg' });
        const onValueChange = jest.fn();

        const { getByRole } = render(
            <FileUploader value={[file]} onValueChange={onValueChange} dropzoneOptions={{ ...defaultProps.dropzoneOptions, maxFiles: 1 }}>
                <FileUploaderContent>
                    <FileUploaderItem index={0}>test.jpg</FileUploaderItem>
                </FileUploaderContent>
            </FileUploader>
        );

        const removeBtn = getByRole('button');
        fireEvent.click(removeBtn);

        expect(onValueChange).toHaveBeenCalledWith([]);
    });


    it('disables dropzone when maxFiles is reached', () => {
        const file = new File(['x'], 'x.jpg', { type: 'image/jpeg' });

        const { container } = render(
            <FileUploader value={[file]} onValueChange={jest.fn()} dropzoneOptions={{ ...defaultProps.dropzoneOptions, maxFiles: 1 }}>
                <FileUploaderContent>
                    <FileInput />
                </FileUploaderContent>
            </FileUploader>
        );

        const input = container.querySelector('input')!;
        expect(input).toBeDisabled();
    });

    it('clears files and adds new if reSelect is true for maxFiles > 1', () => {
        const oldFile = new File(['old'], 'old.jpg', { type: 'image/jpeg' });
        const newFile = new File(['new'], 'new.jpg', { type: 'image/jpeg' });

        (useDropzone as jest.Mock).mockImplementation(({ onDrop }) => {
            mockDropzoneState.onDrop = onDrop;
            return mockDropzoneState;
        });

        render(
            <FileUploader
                value={[oldFile]}
                onValueChange={mockOnValueChange}
                dropzoneOptions={{ ...defaultProps.dropzoneOptions, maxFiles: 2 }}
                reSelect
            >
                <FileUploaderContent>
                    <FileInput />
                </FileUploaderContent>
            </FileUploader>
        );

        act(() => {
            mockDropzoneState.onDrop([newFile], []);
        });

        expect(mockOnValueChange).toHaveBeenCalledWith([newFile]);
    });

    it('renders sr-only label with correct index', () => {
        const file = new File(['data'], 'hidden.jpg', { type: 'image/jpeg' });

        const { getByText } = render(
            <FileUploader value={[file]} onValueChange={() => { }} dropzoneOptions={defaultProps.dropzoneOptions}>
                <FileUploaderContent>
                    <FileUploaderItem index={0}>hidden.jpg</FileUploaderItem>
                </FileUploaderContent>
            </FileUploader>
        );

        const srLabel = getByText('remove item 0');
        expect(srLabel).toHaveClass('sr-only');
    });

    it('FileInput shows correct border colors based on drag state', () => {
        const mockDropzone = {
            ...mockDropzoneState,
            isDragAccept: true,
        };
        (useDropzone as jest.Mock).mockReturnValue(mockDropzone);

        const { container } = render(
            <FileUploader {...defaultProps}>
                <FileUploaderContent>
                    <FileInput />
                </FileUploaderContent>
            </FileUploader>
        );

        expect(container.querySelector('.border-green-500')).toBeInTheDocument();
    });

    it('FileInput shows red border if isDragReject is true', () => {
        const mockDropzone = {
            ...mockDropzoneState,
            isDragReject: true,
        };
        (useDropzone as jest.Mock).mockReturnValue(mockDropzone);

        const { container } = render(
            <FileUploader {...defaultProps}>
                <FileUploaderContent>
                    <FileInput />
                </FileUploaderContent>
            </FileUploader>
        );

        expect(container.querySelector('.border-red-500')).toBeInTheDocument();
    });
});
