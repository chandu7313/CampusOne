import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            _hasHydrated: false,
            notifications: [],

            setAuth: (user, token, refreshToken) => {
                set({ user, token, refreshToken, isAuthenticated: !!user });
                if (user) {
                    get().fetchNotifications();
                }
            },

            addNotification: (notification) => set((state) => ({
                notifications: [notification, ...(state.notifications || [])]
            })),

            fetchNotifications: async () => {
                const { token } = get();
                if (!token) return;
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/v1/notifications`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = await response.json();
                    if (data.status === 'success') {
                        set({ notifications: data.data });
                    }
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            },

            setToken: (token) => set({ token }),

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            logout: () => {
                set({ user: null, token: null, refreshToken: null, isAuthenticated: false, notifications: [] });
            }
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state.setHasHydrated(true);
                if (state.token) {
                    state.fetchNotifications();
                }
            }
        }
    )
);
