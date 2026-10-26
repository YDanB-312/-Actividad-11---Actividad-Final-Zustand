const API_URL = import.meta.env.VITE_API_URL

/**
 * Catálogo:
 * - Con VITE_API_URL definida consume {API_URL}/products (Express, Laravel, etc.).
 * - Sin esa variable consume /products.json, el catálogo local de la práctica.
 */
export async function getProducts() {
  const url = API_URL ? `${API_URL.replace(/\/$/, '')}/products` : '/products.json'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`No fue posible cargar el catálogo (HTTP ${response.status}).`)
  }

  const data = await response.json()

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('El catálogo llegó vacío o con un formato inesperado.')
  }

  return data
}
