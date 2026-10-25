import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'documind_theme';
const PREFERENCES_STORAGE_KEY = 'documind_user_preferences';

export const getStoredTheme = () => {
  try {
    const direct = localStorage.getItem(THEME_STORAGE_KEY);
    if (direct === 'light' || direct === 'dark') return direct;

    const prefsRaw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (prefsRaw) {
      const parsed = JSON.parse(prefsRaw);
      if (parsed?.theme === 'light' || parsed?.theme === 'dark') return parsed.theme;
    }
  } catch {
    // fallback
  }
  return null;
};

export const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const getInitialTheme = () => getStoredTheme() ?? getSystemTheme();

const applyThemeToDocument = (theme) => {
  if (typeof document === 'undefined') return;
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
};

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = (newTheme) => {
    const resolved = newTheme === 'dark' ? 'dark' : 'light';
    setThemeState(resolved);
    applyThemeToDocument(resolved);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, resolved);

      // Keep user preferences object aligned if present
      const prefsRaw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (prefsRaw) {
        const parsed = JSON.parse(prefsRaw);
        parsed.theme = resolved;
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch {
      // ignore storage errors
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    applyThemeToDocument(theme);

    // Sync across browser tabs
    const handleStorageChange = (e) => {
      if (e.key === THEME_STORAGE_KEY && e.newValue) {
        const next = e.newValue === 'dark' ? 'dark' : 'light';
        setThemeState(next);
        applyThemeToDocument(next);
      }
    };

    // Listen for OS system theme changes if user hasn't explicitly set a preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleMediaChange = (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        const next = e.matches ? 'dark' : 'light';
        setThemeState(next);
        applyThemeToDocument(next);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    mediaQuery.addEventListener?.('change', handleMediaChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      mediaQuery.removeEventListener?.('change', handleMediaChange);
    };
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      toggleTheme,
      setTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
