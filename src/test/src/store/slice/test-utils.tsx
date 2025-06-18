import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import type { Api, EndpointDefinitions } from '@reduxjs/toolkit/query';

interface BaseQueryApi {
    signal: AbortSignal;
    abort: (reason?: string) => void;
    getState: () => unknown;
    extra: unknown;
    endpoint: string;
    type: 'query' | 'mutation';

    forced?: boolean;

    queryCacheKey?: string;
}

type MaybePromise<T> = T | PromiseLike<T>;
type QueryReturnValue<T = unknown, E = unknown, M = unknown> = {
    error: E;
    data?: undefined;
    meta?: M;
} | {
    error?: undefined;
    data: T;
    meta?: M;
};

type BaseQueryFn<Args = string, Result = unknown, Error = unknown, DefinitionExtraOptions = object, Meta = object> = (args: Args, api: BaseQueryApi, extraOptions: DefinitionExtraOptions) => MaybePromise<QueryReturnValue<Result, Error, Meta>>;

export function setupApiStore(api: Api<BaseQueryFn, EndpointDefinitions, string, string>) {
    const getStore = () =>
        configureStore({
            reducer: { [api.reducerPath]: api.reducer },
            middleware: (gDM) => gDM().concat(api.middleware),
        });

    const store = getStore();
    setupListeners(store.dispatch);
    return { store };
}