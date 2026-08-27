import { createSlice } from '@reduxjs/toolkit';
import { clearAccessToken, getAccessToken, setAccessToken, setSessionHint } from '@lib/storage';
import { authApi } from './authApi';

const initialState = { user: null, accessToken: getAccessToken(), isBootstrapped: false };

const applyCredentials = (state, { user, accessToken }) => {
  state.user = user;
  state.accessToken = accessToken;
  state.isBootstrapped = true;
  setAccessToken(accessToken);
  setSessionHint(true);
};

const clearCredentials = (state) => {
  state.user = null;
  state.accessToken = null;
  state.isBootstrapped = true;
  clearAccessToken();
  setSessionHint(false);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => applyCredentials(state, action.payload),
    sessionExpired: clearCredentials,
    bootstrapFinished: (state) => {
      state.isBootstrapped = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => applyCredentials(state, action.payload.data))
      .addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => applyCredentials(state, action.payload.data))
      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload;
        state.accessToken = getAccessToken();
        state.isBootstrapped = true;
      })
      .addMatcher(authApi.endpoints.getMe.matchRejected, (state, action) => {
        if (!action.meta.condition) clearCredentials(state);
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, clearCredentials)
      .addMatcher(authApi.endpoints.changePassword.matchFulfilled, clearCredentials);
  },
});

export const { setCredentials, sessionExpired, bootstrapFinished } = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectIsBootstrapped = (state) => state.auth.isBootstrapped;

export default authSlice.reducer;
