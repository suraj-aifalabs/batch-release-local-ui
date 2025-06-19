import axiosMockAdapter from 'axios-mock-adapter';
import axiosInstance from '@/services/axiosInstance';
import { fetchUsers, authAction, getPDF, uploadQCTemplate } from '@/services/apiService';

describe('API calls using axiosInstance', () => {
    let mock: axiosMockAdapter;

    beforeEach(() => {
        mock = new axiosMockAdapter(axiosInstance);
    });

    afterEach(() => {
        mock.restore();
    });

    it('should fetch users successfully', async () => {
        const mockData = { users: [{ name: 'John' }] };
        mock.onGet('/auth/getUsers?pageNo=1&pageSize=10').reply(200, mockData);

        const thunk = fetchUsers({ pageNo: 1, pageSize: 10 });
        const result = await thunk(
            () => { }, // dispatch (mocked)
            () => { }, // getState (mocked)
            undefined
        );

        expect(result.payload).toEqual(mockData);
    });

    it('should handle error in fetchUsers', async () => {
        const errorData = { status: 401, message: 'Unauthorized' };
        mock.onGet('/auth/getUsers?pageNo=1&pageSize=10').reply(401, errorData);

        const thunk = fetchUsers({ pageNo: 1, pageSize: 10 });
        const result = await thunk(() => { }, () => { }, undefined);

        expect(result.payload?.status).toBe(401);
        expect(result.payload?.data).toEqual(errorData);
    });

    it('should perform authAction successfully', async () => {
        const mockData = { success: true };
        mock.onPost('/auth/authAction').reply(200, mockData);

        const result = await authAction({ action: 'login' });

        expect(result).toEqual(mockData);
    });

    it('should handle error in authAction', async () => {
        const errorData = { status: 400, message: 'Invalid' };
        mock.onPost('/auth/authAction').reply(400, errorData);

        const result = await authAction({ action: 'fail' });

        expect(result?.data).toEqual(errorData);
    });

    it('should get PDF blob from server', async () => {
        const blobData = new Blob(['fake pdf content'], { type: 'application/pdf' });
        mock.onPost('document/get_batch_certificate').reply(200, blobData);

        const result = await getPDF({ exception: false, sign: true, batchNumber: '1234' });

        expect(result).toBeInstanceOf(Blob);
        expect(result.type).toBe('application/pdf');
    });

    it('should upload QC template successfully', async () => {
        const mockData = { uploaded: true };
        mock.onPost('/document/upload').reply(200, mockData);

        const formData = new FormData();
        formData.append('file', new Blob(['file content'], { type: 'text/plain' }), 'test.txt');

        const result = await uploadQCTemplate(formData);
        expect(result).toEqual(mockData);
    });

    it('should handle error in uploadQCTemplate', async () => {
        const errorData = { status: 500, message: 'Upload failed' };
        mock.onPost('/document/upload').reply(500, errorData);

        const formData = new FormData();
        formData.append('file', new Blob(['error'], { type: 'text/plain' }), 'fail.txt');

        const result = await uploadQCTemplate(formData);
        expect(result?.data).toEqual(errorData);
    });
});
