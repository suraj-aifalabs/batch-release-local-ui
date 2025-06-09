import axiosInstance from '@/services/axiosInstance';
import { fetchUsers, authAction, getPDF } from '@/services/apiService';
import { AxiosError } from 'axios';

jest.mock('@/services/axiosInstance');

const mockedAxios = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('API Service', () => {
    afterEach(() => jest.clearAllMocks());

    describe('fetchUsers', () => {
        it('should return user data on success', async () => {
            mockedAxios.get.mockResolvedValueOnce({ data: { users: ['user1'] } });

            const thunkApi = {
                dispatch: jest.fn(),
                getState: jest.fn(),
                extra: undefined,
                requestId: '',
                signal: {} as AbortSignal,
                rejectWithValue: jest.fn()
            };

            await fetchUsers({ pageNo: 1, pageSize: 10 })(thunkApi.dispatch, thunkApi.getState, thunkApi);

            expect(mockedAxios.get).toHaveBeenCalledWith('/auth/getUsers?pageNo=1&pageSize=10');
        });

        it('should return error response on failure', async () => {
            const error: Partial<AxiosError> = {
                response: {
                    status: 500,
                    data: { status: 500, message: 'Server error' },
                    statusText: '',
                }
            };
            mockedAxios.get.mockRejectedValueOnce(error);

            const thunkApi = {
                dispatch: jest.fn(),
                getState: jest.fn(),
                extra: undefined,
                requestId: '',
                signal: {} as AbortSignal,
                rejectWithValue: jest.fn((value) => value) // simulate rejectWithValue behavior
            };

            const result = await fetchUsers({ pageNo: 1, pageSize: 10 })(
                thunkApi.dispatch,
                thunkApi.getState,
                thunkApi
            );

            // Check the rejected action type
            expect(result.type).toBe('/auth/getUsers/fulfilled');

            // Check that the payload matches the error structure
            expect(result.payload?.data).toEqual(error.response?.data);

        });

    });

    describe('authAction', () => {
        it('should return auth result on success', async () => {
            mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

            const result = await authAction({ action: 'logout' });

            expect(mockedAxios.post).toHaveBeenCalledWith('/auth/authAction', { action: 'logout' });
            expect(result).toEqual({ success: true });
        });

        it('should return error response on failure', async () => {
            const error: Partial<AxiosError> = {
                response: {
                    status: 403,
                    data: { status: 403, message: 'Forbidden' },
                    statusText: '',
                    headers: {},
                    config: {}
                }
            };
            mockedAxios.post.mockRejectedValueOnce(error);

            const result = await authAction({ action: 'logout' });
            expect(result).toEqual(error.response);
        });
    });

    describe('getPDF', () => {
        it('should return PDF blob on success', async () => {
            const mockBlob = new Blob(['pdf content'], { type: 'application/pdf' });
            mockedAxios.post.mockResolvedValueOnce({ data: mockBlob });

            const result = await getPDF({ batchNumber: "", exception: false, sign: true });

            expect(mockedAxios.post).toHaveBeenCalledWith(
                'document/get_batch_certificate',
                { batchNumber: "", exception: false, sign: true },
                { responseType: 'blob' }
            );
            expect(result).toEqual(mockBlob);
        });

        it('should return error response on failure', async () => {
            const error: Partial<AxiosError> = {
                response: {
                    status: 404,
                    data: { status: 404, message: 'Not Found' },
                    statusText: '',
                    headers: {},
                    config: {}
                }
            };
            mockedAxios.post.mockRejectedValueOnce(error);

            const result = await getPDF({ batchNumber: "", exception: true, sign: false });

            expect(result).toEqual(error.response);
        });
    });
});
