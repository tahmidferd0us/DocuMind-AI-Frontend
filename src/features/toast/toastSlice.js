import { createSlice, nanoid } from '@reduxjs/toolkit';

const DEFAULT_DURATION = 4500;

const toastSlice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    pushToast: {
      reducer: (state, action) => {
        state.items.push(action.payload);
        if (state.items.length > 4) state.items.shift();
      },
      prepare: ({ type = 'info', title, message, duration = DEFAULT_DURATION }) => ({ payload: { id: nanoid(), type, title, message, duration } }),
    },
    dismissToast: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearToasts: (state) => {
      state.items = [];
    },
  },
});

export const { pushToast, dismissToast, clearToasts } = toastSlice.actions;

export const selectToasts = (state) => state.toast.items;

export default toastSlice.reducer;
