import { useMemo } from 'react'
import { useProductStore } from '../store/useProductStore'

export default function CatalogFilters() {
  const search = useProductStore((state) => state.search)
  const category = useProductStore((state) => state.category)
  const products = useProductStore((state) => state.products)
  const setSearch = useProductStore((state) => state.setSearch)
  const setCategory = useProductStore((state) => state.setCategory)
  const clearFilters = useProductStore((state) => state.clearFilters)

  const categories = useMemo(
    () => ['Todas', ...new Set(products.map((product) => product.category))],
    [products],
  )

  const hasFilters = search.trim().length > 0 || category !== 'Todas'

  return (
    <div className="catalog-filters">
      <label className="field">
        <span>Buscar por nombre, categoría o descripción</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Escribe para filtrar"
        />
      </label>

      <div className="category-filter">
        <span className="filter-label">Categoría</span>
        <div className="category-buttons" role="group" aria-label="Filtrar por categoría">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`category-button${category === item ? ' is-active' : ''}`}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button type="button" className="link-button" onClick={clearFilters}>
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
