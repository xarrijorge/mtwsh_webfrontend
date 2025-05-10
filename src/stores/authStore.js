// src/stores/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Fetch } from '../lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Register new user
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await Fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
          });
          localStorage.setItem('token', data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          });
          throw error;
        }
      },

      // Login user
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await Fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
          });
          localStorage.setItem('token', data.token);
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          });
          throw error;
        }
      },

      // Logout user
      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Fetch current user profile
      fetchUser: async () => {
        set({ loading: true });
        try {
          const user = await Fetch('/auth/profile');
          set({
            user,
            loading: false,
          });
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          });
          // Auto-logout if unauthorized
          if (error.message.includes('401')) {
            get().logout();
          }
        }
      },

      // Update user profile
      updateProfile: async (updates) => {
        set({ loading: true });
        try {
          const user = await Fetch('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(updates),
          });
          set({
            user,
            loading: false,
          });
        } catch (error) {
          set({
            error: error.message,
            loading: false,
          });
          throw error;
        }
      },

      // Clear errors
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);