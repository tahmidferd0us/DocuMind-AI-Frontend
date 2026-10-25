import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'documind_user_preferences';

const loadPreferences = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const defaultPreferences = {
  theme: 'light',
  defaultSummaryMethod: 'extractive',
  defaultSentenceCount: 5,
  defaultExportFormat: 'pdf',
  defaultQaStyle: 'grounded',
  emailNotifications: true,
  activityLogging: true,
};

const initialState = {
  preferences: { ...defaultPreferences, ...(loadPreferences() ?? {}) },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.preferences));
      } catch {
        // ignore storage errors
      }
    },
    resetPreferences: (state) => {
      const currentTheme = state.preferences?.theme ?? 'light';
      state.preferences = { ...defaultPreferences, theme: currentTheme };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.preferences));
      } catch {
        // ignore storage errors
      }
    },
  },
});

export const { updatePreferences, resetPreferences } = profileSlice.actions;

export const selectUserPreferences = (state) => state.profile?.preferences ?? defaultPreferences;

export default profileSlice.reducer;
