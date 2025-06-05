import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/utils/ErrorBoundary';

let consoleErrorMock: jest.SpyInstance;

beforeAll(() => {
    consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterAll(() => {
    consoleErrorMock.mockRestore();
});

beforeEach(() => {
    consoleErrorMock.mockClear();
});

const WorkingComponent = () => <div>Working Component</div>;

const ErrorComponent = () => {
    throw new Error('Test error');
};

const ErrorComponentWithMessage = ({ message }: { message: string }) => {
    throw new Error(message);
};

describe('ErrorBoundary', () => {
    test('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <WorkingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Working Component')).toBeInTheDocument();
    });

    test('renders default fallback UI when child throws an error', () => {
        const originalConsoleError = console.error;
        console.error = jest.fn();

        render(
            <ErrorBoundary>
                <ErrorComponent />
            </ErrorBoundary>
        );

        console.error = originalConsoleError;

        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
        expect(screen.getByText(/Error: Test error/)).toBeInTheDocument();
    });

    test('renders custom fallback when provided and child throws an error', () => {
        const originalConsoleError = console.error;
        console.error = jest.fn();

        render(
            <ErrorBoundary fallback={<div>Custom Error UI</div>}>
                <ErrorComponent />
            </ErrorBoundary>
        );

        console.error = originalConsoleError;

        expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    });

    test('captures the specific error message', () => {
        const originalConsoleError = console.error;
        console.error = jest.fn();

        const errorMessage = 'Specific error message for testing';
        render(
            <ErrorBoundary>
                <ErrorComponentWithMessage message={errorMessage} />
            </ErrorBoundary>
        );

        // Restore console.error
        console.error = originalConsoleError;

        expect(screen.getByText(/Error: Specific error message for testing/)).toBeInTheDocument();
    });


    test('handles nested components with errors', () => {
        const originalConsoleError = console.error;
        console.error = jest.fn();

        render(
            <ErrorBoundary>
                <div>
                    <h1>Parent Component</h1>
                    <div>
                        <ErrorComponent />
                    </div>
                </div>
            </ErrorBoundary>
        );

        console.error = originalConsoleError;

        expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
        expect(screen.queryByText('Parent Component')).not.toBeInTheDocument();
    });

    test('handles multiple error boundaries appropriately', () => {
        const originalConsoleError = console.error;
        console.error = jest.fn();

        render(
            <div>
                <ErrorBoundary fallback={<div>Outer Error Boundary</div>}>
                    <div>
                        <h1>Outer Component</h1>
                        <ErrorBoundary fallback={<div>Inner Error Boundary</div>}>
                            <ErrorComponent />
                        </ErrorBoundary>
                    </div>
                </ErrorBoundary>
            </div>
        );

        console.error = originalConsoleError;

        expect(screen.getByText('Inner Error Boundary')).toBeInTheDocument();
        expect(screen.getByText('Outer Component')).toBeInTheDocument();
        expect(screen.queryByText('Outer Error Boundary')).not.toBeInTheDocument();
    });

    test('uses correct state when error occurs', () => {

        const error = new Error('Test state error');
        const state = ErrorBoundary.getDerivedStateFromError(error);

        expect(state).toEqual({
            hasError: true,
            error: error
        });
    });

    test('componentDidCatch updates state with error info', () => {
        const errorBoundary = new ErrorBoundary({ children: <div /> });

        errorBoundary.setState = jest.fn();

        const error = new Error('Test error for componentDidCatch');
        const errorInfo = { componentStack: 'Component stack trace' } as React.ErrorInfo;

        errorBoundary.componentDidCatch(error, errorInfo);

        expect(errorBoundary.setState).toHaveBeenCalledWith({
            error: error,
            errorInfo: errorInfo
        });
    });
});