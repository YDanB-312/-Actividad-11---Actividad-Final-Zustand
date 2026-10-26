import { create } from 'zustand'

const API = import.meta.env.VITE_API_URL

const catalogUrl = API
  ? `${API.replace(/\/$/, '')}/products`
  : '/products.json'

const initialFilters = {
  search: '',
  category: 'Todas',
}

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  ...initialFilters,

  fetchProducts: async (force = false) => {
    const { products, loading } = get()

    if (!force && (loading || products.length > 0)) return

    set({ loading: true, error: null })

    try {
      const response = await fetch(catalogUrl)

      if (!response.ok) {
        throw new Error(`No fue posible cargar el catálogo (HTTP ${response.status}).`)
      }

      const data = await response.json()

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('El catálogo llegó vacío o con un formato inesperado.')
      }

      set({ products: data, loading: false, error: null })
    } catch (error) {
      set({
        loading: false,
        error: error.message || 'No fue posible cargar el catálogo.',
      })
    }
  },

  setSearch: (search) => set({ search }),
  setCategory: (category) => set({ category }),
  clearFilters: () => set(initialFilters),
}))

export const selectFilteredProducts = (state) => {
  const term = state.search.trim().toLowerCase()

  return state.products.filter((product) => {
    const matchesCategory =
      state.category === 'Todas' || product.category === state.category
    const searchable = `${product.name} ${product.description} ${product.category}`.toLowerCase()
    const matchesSearch = !term || searchable.includes(term)

    return matchesCategory && matchesSearch
  })
}
