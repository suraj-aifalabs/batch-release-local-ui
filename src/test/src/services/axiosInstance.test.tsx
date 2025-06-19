import axiosMockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/services/axiosInstance';
import * as cookieUtils from '@/utils/cookieUtils';

describe('axiosInstance', () => {
    let mock: axiosMockAdapter;

    beforeEach(() => {
        mock = new axiosMockAdapter(axiosInstance);
    });

    afterEach(() => {
        mock.reset();
    });

    it('adds Authorization header if token exists', async () => {
        const dummyToken = 'dummy-token';
        jest.spyOn(cookieUtils, 'getIdTokenFromCookie').mockReturnValue(dummyToken);

        mock.onGet('/test').reply((config) => {
            expect(config.headers?.Authorization).toBe(`Bearer ${dummyToken}`);
            return [200, { success: true }];
        });

        const response = await axiosInstance.get('/test');
        expect(response.status).toBe(200);
        expect(response.data.success).toBe(true);
    });

    it('redirects on session expired response', async () => {
        // Mock token (to allow request to go through)
        jest.spyOn(cookieUtils, 'getIdTokenFromCookie').mockReturnValue('some-token');

        delete (window as any).location;
        (window as any).location = { href: '' }; // mock window.location.href

        mock.onGet('/test').reply(401, {
            isActiveSession: false,
            message: 'Session expired',
        });

        try {
            await axiosInstance.get('/test');
        } catch (error) {
            expect(window.location.href).toBe('/session-expired');
        }
    });


});
