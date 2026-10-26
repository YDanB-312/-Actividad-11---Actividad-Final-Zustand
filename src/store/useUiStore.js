import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUiStore = create(
  persist(
    (set) => ({
      theme: 'light',
      isCartOpen: false,

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      setTheme: (theme) => set({ theme }),

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: 'tienda-sena-ui',
      // El tema sobrevive a la recarga; el panel abierto no.
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
