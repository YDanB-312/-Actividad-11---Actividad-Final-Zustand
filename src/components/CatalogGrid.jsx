import { useShallow } from 'zustand/react/shallow'
import { selectFilteredProducts, useProductStore } from '../store/useProductStore'
import ProductCard from './ProductCard'

export default function CatalogGrid() {
  const products = useProductStore((state) => state.products)
  const filteredProducts = useProductStore(useShallow(selectFilteredProducts))
  const loading = useProductStore((state) => state.loading)
  const error = useProductStore((state) => state.error)
  const search = useProductStore((state) => state.search)
  const category = useProductStore((state) => state.category)
  const fetchProducts = useProductStore((state) => state.fetchProducts)
  const clearFilters = useProductStore((state) => state.clearFilters)

  if (loading && products.length === 0) {
    return <p className="status-message">Cargando catálogo…</p>
  }

  if (error && products.length === 0) {
    return (
      <div className="status-message status-error" role="alert">
        <p>{error}</p>
        <button
          type="button"
          className="button button-small"
          onClick={() => fetchProducts(true)}
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="status-message">
        <p>
          No hay productos con esa búsqueda
          {category !== 'Todas' ? ` en la categoría ${category}` : ''}.
        </p>
        <button type="button" className="link-button" onClick={clearFilters}>
          Ver todo el catálogo
        </button>
      </div>
    )
  }

  return (
    <>
      <p className="results-count">
        {filteredProducts.length} de {products.length} productos
        {search.trim() ? ` para “${search}”` : ''}
      </p>
      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  )
}
