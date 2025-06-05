import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

jest.mock('react-dom/client', () => {
    const renderMock = jest.fn();
    return {
        createRoot: jest.fn(() => ({
            render: renderMock
        })),
        _renderMock: renderMock
    };
});

jest.mock('../App', () => {
    const MockApp = () => <div>Mocked App</div>;
    MockApp.displayName = 'App';
    return MockApp;
});

describe('Application bootstrap', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
        jest.clearAllMocks();

        mockElement = document.createElement('div');
        mockElement.id = 'root';
        document.getElementById = jest.fn(() => mockElement);
    });

    it('renders the App component into the DOM with StrictMode', () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('../bootstrap');

        expect(document.getElementById).toHaveBeenCalledWith('root');

        expect(createRoot).toHaveBeenCalledWith(mockElement);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const renderMock = require('react-dom/client')._renderMock;

        expect(renderMock).toHaveBeenCalled();

        const renderedArg = renderMock.mock.calls[0][0];
        expect(renderedArg.type).toBe(StrictMode);

        expect(renderedArg.props.children.type.displayName || renderedArg.props.children.type.name).toBe('App');
    });
});
