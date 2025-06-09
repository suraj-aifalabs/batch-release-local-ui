import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "./axiosInstance";
import type { AxiosError } from "axios";

interface ErrorResponse {
    status: number;
    message: string;
}

interface AuthActionPayload {
    action: string;
}

interface PdfPayload {
    exception: boolean;
    sign: boolean;
    batchNumber: string;
}


export const fetchUsers = createAsyncThunk("/auth/getUsers", async ({ pageNo, pageSize }: { pageNo: number; pageSize: number }) => {
    try {
        const response = await axiosInstance.get(`/auth/getUsers?pageNo=${pageNo}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            return axiosError.response;
        }
    }
});

export const authAction = async (data: AuthActionPayload) => {
    try {
        const response = await axiosInstance.post("/auth/authAction", data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            return axiosError.response;
        }
    }
};

export const getPDF = async (data: PdfPayload) => {
    try {
        const response = await axiosInstance.post("document/get_batch_certificate", data, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            return axiosError.response;
        }
    }
};

export const uploadQCTemplate = async (data: FormData) => {
    try {
        const response = await axiosInstance.post("/document/upload", data);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response) {
            return axiosError.response;
        }
    }
};