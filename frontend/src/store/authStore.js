import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: !!user
    }),

    setToken: (token) => set({ token }),

    logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Backend call to clear refresh cookie should be done in the component/action
    }
}));
