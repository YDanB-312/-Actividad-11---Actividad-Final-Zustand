import { useEffect } from 'react'
import CatalogFilters from '../components/CatalogFilters'
import CatalogGrid from '../components/CatalogGrid'
import { CounterButtons, CounterDisplay } from '../components/Counter'
import { useProductStore } from '../store/useProductStore'

export default function Catalog() {
  const fetchProducts = useProductStore((state) => state.fetchProducts)

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <main className="container page">
      <header className="page-header">
        <h1>Tienda SENA</h1>
        <p>
          Catálogo de práctica del taller de Zustand. Los productos se cargan de
          forma asíncrona y el carrito, los favoritos y los filtros se comparten
          entre componentes mediante stores.
        </p>
      </header>

      <section className="section" aria-labelledby="catalog-title">
        <div className="section-header">
          <h2 id="catalog-title">Catálogo</h2>
          <p className="hint">
            Buscador y filtros en <code>useProductStore</code>; tarjetas en{' '}
            <code>ProductCard</code>.
          </p>
        </div>
        <CatalogFilters />
        <CatalogGrid />
      </section>

      <section className="section" aria-labelledby="counter-title">
        <div className="section-header">
          <h2 id="counter-title">Contador</h2>
          <p className="hint">
            Paso 2 y 3 de la guía: <code>useCounterStore</code> y selectores.
          </p>
        </div>
        <div className="counter-demo">
          <CounterDisplay />
          <CounterButtons />
        </div>
      </section>
    </main>
  )
}
