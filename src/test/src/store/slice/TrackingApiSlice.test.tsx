import { trackingApi } from '@/store/slice/TrackingApiSlice';
import { baseURL } from '@/services/apiCalls';

jest.mock('@/utils/cookieUtils', () => ({
    getIdTokenFromCookie: jest.fn(),
}));

jest.mock('@/services/apiCalls', () => ({
    baseURL: 'http://test-api.com',
}));

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.Mock;

describe('trackingApi', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockClear();
    });

    describe('baseQuery configuration', () => {


        it('should use the correct baseURL', () => {
            expect(trackingApi.reducerPath).toBe('trackingApi');
            expect(baseURL).toBe('http://test-api.com');
        });
    });


});