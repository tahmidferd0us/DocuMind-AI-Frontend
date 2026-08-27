const ACCESS_TOKEN_KEY = 'documind.accessToken';
const SESSION_HINT_KEY = 'documind.hasSession';

const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const getAccessToken = () => safe(() => localStorage.getItem(ACCESS_TOKEN_KEY));

export const setAccessToken = (token) => safe(() => (token ? localStorage.setItem(ACCESS_TOKEN_KEY, token) : localStorage.removeItem(ACCESS_TOKEN_KEY)));

export const clearAccessToken = () => safe(() => localStorage.removeItem(ACCESS_TOKEN_KEY));

export const hasSessionHint = () => safe(() => localStorage.getItem(SESSION_HINT_KEY) === '1', false);

export const setSessionHint = (value) => safe(() => (value ? localStorage.setItem(SESSION_HINT_KEY, '1') : localStorage.removeItem(SESSION_HINT_KEY)));
