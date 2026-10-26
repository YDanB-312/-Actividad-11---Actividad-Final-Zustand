import { Link, NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { selectTotalItems, useCartStore } from '../store/useCartStore'
import { useUiStore } from '../store/useUiStore'

export default function Navbar() {
  const totalItems = useCartStore(selectTotalItems)
  const theme = useUiStore((state) => state.theme)
  const toggleTheme = useUiStore((state) => state.toggleTheme)
  const openCart = useUiStore((state) => state.openCart)
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          Tienda SENA
        </Link>

        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/" end>
            Catálogo
          </NavLink>
          <NavLink to="/favoritos">Favoritos</NavLink>
        </nav>

        <div className="header-actions">
          <button type="button" className="button button-ghost" onClick={toggleTheme}>
            {theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          </button>
          <button type="button" className="button button-ghost" onClick={openCart}>
            Carrito ({totalItems})
          </button>
          {token ? (
            <NavLink to="/perfil" className="button button-ghost">
              {user?.name?.split(' ')[0] ?? 'Perfil'}
            </NavLink>
          ) : (
            <NavLink to="/login" className="button button-primary">
              Ingresar
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}
