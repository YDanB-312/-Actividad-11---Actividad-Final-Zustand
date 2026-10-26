import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginRequest } from '../services/authApi'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async ({ email, password }) => {
        set({ loading: true, error: null })

        try {
          const data = await loginRequest({ email, password })
          set({ user: data.user, token: data.token, loading: false })
          return true
        } catch (error) {
          set({
            error: error.message || 'No fue posible iniciar sesión.',
            loading: false,
          })
          return false
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      clearError: () => set({ error: null }),

      isAuthenticated: () => Boolean(get().token),
    }),
    {
      name: 'tienda-sena-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
)
