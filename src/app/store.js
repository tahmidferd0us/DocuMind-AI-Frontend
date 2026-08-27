import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { api } from '@lib/api';
import { featureReducers } from '@features/registry';

export const store = configureStore({
  reducer: { ...featureReducers, [api.reducerPath]: api.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: { ignoredActionPaths: ['meta.arg', 'payload.file'] } }).concat(api.middleware),
  devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);
