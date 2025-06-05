import Cookies from 'universal-cookie';
import {
    getFullNameFromCookie,
    getUsernameFromCookie,
    getAccessTokenFromCookie,
    getIdTokenFromCookie,
} from '@/utils/cookieUtils';



describe('cookieUtils', () => {
    let cookiesGetSpy: jest.SpyInstance;

    beforeEach(() => {
        cookiesGetSpy = jest.spyOn(Cookies.prototype, 'get');
    });

    afterEach(() => {
        cookiesGetSpy.mockRestore();
    });

    test('getFullNameFromCookie returns correct value', () => {
        cookiesGetSpy.mockReturnValue('John Doe');
        expect(getFullNameFromCookie()).toBe('John Doe');
        expect(cookiesGetSpy).toHaveBeenCalledWith('10ec2c8cd682a81da2adff0e0cc9660a');
    });

    test('getUsernameFromCookie returns correct value', () => {
        cookiesGetSpy.mockReturnValue('johndoe');
        expect(getUsernameFromCookie()).toBe('johndoe');
        expect(cookiesGetSpy).toHaveBeenCalledWith('368bf182bbac3104e48cbe3213c3af50');
    });

    test('getAccessTokenFromCookie returns correct value', () => {
        cookiesGetSpy.mockReturnValue('mock-access-token');
        expect(getAccessTokenFromCookie()).toBe('mock-access-token');
        expect(cookiesGetSpy).toHaveBeenCalledWith('d95ec1a6c067bdc116d48fcc923c7c75');
    });

    test('getIdTokenFromCookie returns correct value', () => {
        cookiesGetSpy.mockReturnValue('mock-id-token');
        expect(getIdTokenFromCookie()).toBe('mock-id-token');
        expect(cookiesGetSpy).toHaveBeenCalledWith('91b84dd50961309e2720e24903e1e6cd');
    });
});
