import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  upgradeModal: {
    isOpen: false,
    feature: null,
    reason: null,
    message: null,
    limit: null,
    current: null,
    requiredTier: 'PRO',
  },
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    openUpgradeModal: (state, action) => {
      state.upgradeModal = {
        isOpen: true,
        feature: action.payload?.feature || null,
        reason: action.payload?.reason || null,
        message: action.payload?.message || null,
        limit: action.payload?.limit || null,
        current: action.payload?.current || null,
        requiredTier: action.payload?.requiredTier || 'PRO',
      };
    },
    closeUpgradeModal: (state) => {
      state.upgradeModal.isOpen = false;
    },
  },
});

export const { openUpgradeModal, closeUpgradeModal } = subscriptionsSlice.actions;

export const selectUpgradeModal = (state) => state.subscriptions?.upgradeModal || initialState.upgradeModal;

export default subscriptionsSlice.reducer;
