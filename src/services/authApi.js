const API_URL = import.meta.env.VITE_API_URL

export const DEMO_CREDENTIALS = {
  email: 'demo@tienda.sena',
  password: 'sena2026',
}

const DEMO_USER = {
  id: 'aprendiz-001',
  name: 'Ana María Rojas',
  email: DEMO_CREDENTIALS.email,
  role: 'Aprendiz ADSO',
  program: 'Análisis y Desarrollo de Software',
  code: '228118',
  joined: '2026-02-02',
}

/**
 * Inicio de sesión:
 * - Con VITE_API_URL definida hace POST a {API_URL}/auth/login.
 * - Sin esa variable simula la respuesta del backend con las credenciales demo.
 *   El token es ficticio: en producción debe ser una cookie httpOnly.
 */
export async function loginRequest({ email, password }) {
  if (API_URL) {
    const response = await fetch(`${API_URL.replace(/\/$/, '')}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data.message || 'Correo o contraseña incorrectos.')
    }

    return data
  }

  const normalizedEmail = email.trim().toLowerCase()

  if (normalizedEmail !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
    throw new Error('Correo o contraseña incorrectos. Usa las credenciales de demostración.')
  }

  return {
    user: DEMO_USER,
    token: `demo.${DEMO_USER.id}.${Date.now().toString(36)}`,
  }
}
