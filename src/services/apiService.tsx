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