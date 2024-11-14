// store.js
import { create } from 'zustand';
import { createAuthSlice } from './slices/authSlice';

export const useAppStore = create((set) => ({
  ...createAuthSlice(set), // Spread the auth slice into the main store
}));
