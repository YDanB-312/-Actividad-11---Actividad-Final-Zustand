import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function Profile() {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <main className="container page">
      <header className="page-header">
        <h1>Mi perfil</h1>
        <p>
          Ruta protegida con <code>ProtectedRoute</code>: si no hay token en{' '}
          <code>useAuthStore</code>, redirige a <code>/login</code>.
        </p>
      </header>

      <dl className="profile-data">
        <div>
          <dt>Nombre</dt>
          <dd>{user?.name ?? 'Aprendiz SENA'}</dd>
        </div>
        <div>
          <dt>Correo</dt>
          <dd>{user?.email ?? 'demo@tienda.sena'}</dd>
        </div>
        <div>
          <dt>Rol</dt>
          <dd>{user?.role ?? 'Aprendiz ADSO'}</dd>
        </div>
        <div>
          <dt>Programa</dt>
          <dd>{user?.program ?? 'Análisis y Desarrollo de Software'}</dd>
        </div>
        <div>
          <dt>Token de demostración</dt>
          <dd>
            <code>{token ? `••••••${token.slice(-6)}` : '—'}</code>
          </dd>
        </div>
      </dl>

      <button type="button" className="button button-primary" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </main>
  )
}
