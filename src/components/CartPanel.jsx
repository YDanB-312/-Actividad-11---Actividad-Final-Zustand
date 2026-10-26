import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { selectSubtotal, selectTotalItems, useCartStore } from '../store/useCartStore'
import { useUiStore } from '../store/useUiStore'

export default function CartPanel() {
  const isOpen = useUiStore((state) => state.isCartOpen)
  const closeCart = useUiStore((state) => state.closeCart)

  const items = useCartStore((state) => state.items)
  const updateQty = useCartStore((state) => state.updateQty)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalItems = useCartStore(selectTotalItems)
  const total = useCartStore(selectSubtotal)

  useEffect(() => {
    if (!isOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeCart()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  return createPortal(
    <div className="cart-overlay">
      <button
        type="button"
        className="cart-backdrop"
        onClick={closeCart}
        aria-label="Cerrar carrito"
      />

      <aside className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="cart-header">
          <h2 id="cart-title">Carrito ({totalItems})</h2>
          <button type="button" className="button button-ghost" onClick={closeCart}>
            Cerrar
          </button>
        </header>

        {items.length === 0 ? (
          <p className="status-message">El carrito está vacío.</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>$ {item.price.toLocaleString('es-CO')}</span>
                  </div>

                  <div className="cart-item-actions">
                    <button
                      type="button"
                      className="quantity-button"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label={`Quitar una unidad de ${item.name}`}
                    >
                      −
                    </button>
                    <span>{item.qty}</span>
                    <button
                      type="button"
                      className="quantity-button"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label={`Agregar una unidad de ${item.name}`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => removeItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>

                  <span className="cart-item-total">
                    $ {(item.price * item.qty).toLocaleString('es-CO')}
                  </span>
                </li>
              ))}
            </ul>

            <footer className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <strong>$ {total.toLocaleString('es-CO')}</strong>
              </div>
              <div className="cart-footer-actions">
                <button type="button" className="button button-ghost" onClick={clearCart}>
                  Vaciar carrito
                </button>
                <button type="button" className="button button-primary" onClick={closeCart}>
                  Seguir comprando
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>,
    document.body,
  )
}
