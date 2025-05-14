import { configureStore } from '@reduxjs/toolkit';
import { trackingApi } from './slice/TrackingApiSlice';

export const store = configureStore({
    reducer: {
        [trackingApi.reducerPath]: trackingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(trackingApi.middleware),
});