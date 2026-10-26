import ProductCard from '../components/ProductCard'
import { useFavoritesStore } from '../store/useFavoritesStore'

export default function Favorites() {
  const favorites = useFavoritesStore((state) => state.favorites)

  return (
    <main className="container page">
      <header className="page-header">
        <h1>Favoritos</h1>
        <p>
          Esta lista vive en <code>useFavoritesStore</code> y se guarda en{' '}
          <code>localStorage</code> con el middleware <code>persist</code>.
        </p>
      </header>

      {favorites.length === 0 ? (
        <p className="status-message">
          No tienes favoritos todavía. Marca el corazón de un producto en el
          catálogo.
        </p>
      ) : (
        <div className="product-grid">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
