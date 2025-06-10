import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import type { Api } from '@reduxjs/toolkit/query';

export function setupApiStore(api: Api<any, any, any, any, any>) {
    const getStore = () =>
        configureStore({
            reducer: { [api.reducerPath]: api.reducer },
            middleware: (gDM) => gDM().concat(api.middleware),
        });

    const store = getStore();
    setupListeners(store.dispatch);
    return { store };
}