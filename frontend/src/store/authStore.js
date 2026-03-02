import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            _hasHydrated: false,

            setAuth: (user, token) => set({
                user,
                token,
                isAuthenticated: !!user
            }),

            setToken: (token) => set({ token }),

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
            }
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
            }
        }
    )
);
