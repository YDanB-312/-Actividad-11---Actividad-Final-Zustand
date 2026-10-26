import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function Login() {
  const token = useAuthStore((state) => state.token)
  const login = useAuthStore((state) => state.login)
  const loading = useAuthStore((state) => state.loading)
  const error = useAuthStore((state) => state.error)
  const clearError = useAuthStore((state) => state.clearError)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/perfil'

  const [form, setForm] = useState({ email: '', password: '' })

  if (token) return <Navigate to={from} replace />

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (error) clearError()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await login(form.email, form.password)
    if (success) navigate(from, { replace: true })
  }

  return (
    <main className="container form-page">
      <h1>Iniciar sesión</h1>
      <p>
        Acción asíncrona de <code>useAuthStore</code> con manejo de{' '}
        <code>loading</code> y <code>error</code>.
      </p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Correo electrónico</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            minLength={6}
            required
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="button button-primary" disabled={loading}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>

      <p className="hint">
        Credenciales de demostración: <code>demo@tienda.sena</code> /{' '}
        <code>sena2026</code>
      </p>
    </main>
  )
}
