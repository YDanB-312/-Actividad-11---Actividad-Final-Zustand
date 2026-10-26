import { useAuthStore } from '../store/useAuthStore'

const API_URL = import.meta.env.VITE_API_URL

/**
 * Plantilla de integración para llamar al backend del proyecto con el token
 * que vive en useAuthStore.
 *
 * No se usa en la demo porque el catálogo y el login tienen sus propios
 * servicios, pero muestra cómo leer un store fuera de un componente y cómo
 * cerrar la sesión cuando el backend responde 401.
 */
export async function apiFetch(path, options = {}) {
  const token = useAuthStore.getState().token
  const base = API_URL ? API_URL.replace(/\/$/, '') : ''

  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })

  if (response.status === 401) {
    useAuthStore.getState().logout()
  }

  return response
}
