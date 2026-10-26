import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        items: [], // [{ id, name, price, qty }]

        addItem: (product) =>
          set(
            (state) => {
              const exists = state.items.find((item) => item.id === product.id)

              if (exists) {
                return {
                  items: state.items.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
                  ),
                }
              }

              return {
                items: [
                  ...state.items,
                  {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    qty: 1,
                  },
                ],
              }
            },
            false,
            'cart/addItem',
          ),

        removeItem: (id) =>
          set(
            (state) => ({ items: state.items.filter((item) => item.id !== id) }),
            false,
            'cart/removeItem',
          ),

        updateQty: (id, qty) =>
          set(
            (state) => ({
              items: state.items
                .map((item) =>
                  item.id === id ? { ...item, qty: Math.max(0, Number(qty) || 0) } : item,
                )
                .filter((item) => item.qty > 0),
            }),
            false,
            'cart/updateQty',
          ),

        clearCart: () => set({ items: [] }, false, 'cart/clear'),

        // Valores derivados para usar fuera de los componentes.
        totalItems: () => get().items.reduce((acc, item) => acc + item.qty, 0),
        totalPrice: () =>
          get().items.reduce((acc, item) => acc + item.price * item.qty, 0),
      }),
      {
        name: 'tienda-sena-cart',
        partialize: (state) => ({ items: state.items }),
      },
    ),
    { name: 'CartStore' },
  ),
)

export const selectTotalItems = (state) =>
  state.items.reduce((acc, item) => acc + item.qty, 0)

export const selectSubtotal = (state) =>
  state.items.reduce((acc, item) => acc + item.price * item.qty, 0)
