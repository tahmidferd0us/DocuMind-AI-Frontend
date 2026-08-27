import axios from 'axios';
import { API_BASE_URL, REFRESH_ENDPOINT } from './constants';
import { clearAccessToken, getAccessToken, setAccessToken } from './storage';

const NO_REFRESH_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

let onSessionExpired = () => {};

export const setSessionExpiredHandler = (handler) => { onSessionExpired = handler; };

export const httpClient = axios.create({ baseURL: API_BASE_URL, withCredentials: true, timeout: 30_000 });

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise = null;

const refreshSession = () => {
  refreshPromise ??= httpClient
    .post(REFRESH_ENDPOINT)
    .then((response) => {
      const token = response.data?.data?.accessToken ?? null;
      setAccessToken(token);
      return token;
    })
    .catch((error) => {
      clearAccessToken();
      onSessionExpired();
      throw error;
    })
    .finally(() => { refreshPromise = null; });
  return refreshPromise;
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config ?? {};
    const shouldSkip = error.response?.status !== 401 || config._retried || NO_REFRESH_ROUTES.some((route) => config.url?.startsWith(route));
    if (shouldSkip) return Promise.reject(error);
    config._retried = true;
    try {
      await refreshSession();
      return await httpClient(config);
    } catch {
      return Promise.reject(error);
    }
  },
);
