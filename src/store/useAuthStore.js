import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API = import.meta.env.VITE_API_URL

const DEMO_USER = {
  id: 'aprendiz-001',
  name: 'Ana María Rojas',
  email: 'demo@tienda.sena',
  role: 'Aprendiz ADSO',
  program: 'Análisis y Desarrollo de Software',
}

const DEMO_PASSWORD = 'sena2026'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })

        try {
          let data

          if (API) {
            const response = await fetch(`${API.replace(/\/$/, '')}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password }),
            })

            data = await response.json().catch(() => ({}))

            if (!response.ok) {
              throw new Error(data.message || 'Credenciales inválidas')
            }
          } else {
            if (email.trim().toLowerCase() !== DEMO_USER.email || password !== DEMO_PASSWORD) {
              throw new Error('Correo o contraseña incorrectos. Usa las credenciales de demostración.')
            }

            data = {
              user: DEMO_USER,
              token: `demo.${DEMO_USER.id}.${Date.now().toString(36)}`,
            }
          }

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
