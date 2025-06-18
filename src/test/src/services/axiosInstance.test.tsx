import axios from 'axios';

// Mock axios and cookieUtils
jest.mock('axios');
jest.mock('@/utils/cookieUtils', () => ({
    getIdTokenFromCookie: jest.fn(),
}));

const mockRequestInterceptor = jest.fn();
const mockResponseInterceptor = {
    success: jest.fn(),
    error: jest.fn(),
};

const mockAxiosInstance = {
    interceptors: {
        request: {
            use: jest.fn((success) => {
                mockRequestInterceptor.mockImplementation(success);
                return jest.fn();
            }),
        },
        response: {
            use: jest.fn((success, error) => {
                mockResponseInterceptor.success.mockImplementation(success);
                mockResponseInterceptor.error.mockImplementation(error);
                return jest.fn();
            }),
        },
    },
};

(axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

const originalWindowLocation = window.location;
const originalSessionStorage = window.sessionStorage;

beforeEach(() => {
    jest.clearAllMocks();

    delete window.location;
    window.location = {
        ...originalWindowLocation,
        href: 'http://localhost/',
        assign: jest.fn(),
        replace: jest.fn(),
    };

    delete window.sessionStorage;
    window.sessionStorage = {
        ...originalSessionStorage,
        clear: jest.fn(),
    };
});

afterAll(() => {
    window.location = originalWindowLocation;
    window.sessionStorage = originalSessionStorage;
});

describe('axiosInstance configuration', () => {

    describe('response interceptor', () => {
        it('should redirect to session-expired when session is inactive', async () => {
            const error = {
                response: {
                    data: {
                        isActiveSession: false,
                        message: 'Session expired'
                    }
                }
            };


            try {
                await mockResponseInterceptor.error(error);
            } catch (e) {
                console.log("error catch in test", e);
                expect(window.sessionStorage.clear).toHaveBeenCalled();
                expect(window.location.href).toBe('/session-expired');
            }
        });

        it('should not redirect for other errors', async () => {
            const error = {
                response: {
                    status: 500,
                    data: {
                        message: 'Internal server error'
                    }
                }
            };


            try {
                await mockResponseInterceptor.error(error);
            } catch (e) {
                console.log("error catch in test", e);
                expect(window.sessionStorage.clear).not.toHaveBeenCalled();
                expect(window.location.href).toBe('http://localhost/');
            }
        });

        it('should handle non-response errors', async () => {
            const error = new Error('Network error');


            try {
                await mockResponseInterceptor.error(error);
            } catch (e) {
                console.log("error catch in test", e);
                expect(window.sessionStorage.clear).not.toHaveBeenCalled();
                expect(window.location.href).toBe('http://localhost/');
            }
        });
    });
});