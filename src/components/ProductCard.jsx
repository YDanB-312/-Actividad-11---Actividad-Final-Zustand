import { useCartStore } from '../store/useCartStore'
import { useFavoritesStore } from '../store/useFavoritesStore'
import { formatCOP } from '../utils/format'

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((item) => item.id === product.id),
  )

  return (
    <article className="product-card">
      <div className="product-card-head">
        <span className="product-category">{product.category}</span>
        <button
          type="button"
          className={`favorite-button${isFavorite ? ' is-favorite' : ''}`}
          onClick={() => toggleFavorite(product)}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Quitar ${product.name} de favoritos`
              : `Agregar ${product.name} a favoritos`
          }
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>

      <h3>{product.name}</h3>
      <p>{product.description}</p>

      <div className="product-card-foot">
        <span className="price">{formatCOP(product.price)}</span>
        <button
          type="button"
          className="button button-small"
          onClick={() => addItem(product)}
        >
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}
