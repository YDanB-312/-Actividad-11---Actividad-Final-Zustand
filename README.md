# Tienda SENA

Aplicación de práctica del taller **Zustand en React con Vite** (SENA · ADSO 228118 · RAP3). Incluye catálogo, carrito, favoritos, tema claro/oscuro, filtros, contador, persistencia, Redux DevTools y una ruta protegida.

## Stack

- React 19
- Vite
- Zustand 5
- React Router 7
- JavaScript (`.js` / `.jsx`)

## Ejecutar

```bash
cd tienda-sena
npm install
npm run dev
```

```bash
npm run build     # build de producción
npm run preview   # sirve el build
```

### Credenciales de demostración

```text
Correo:     demo@tienda.sena
Contraseña: sena2026
```

Sin backend, `src/services/authApi.js` simula la respuesta. Si se define `VITE_API_URL`, se hace un `POST` real a `{VITE_API_URL}/auth/login`.

### Variables de entorno

```env
# Opcional. Si se define, la app consume {VITE_API_URL}/products y /auth/login.
# Si se deja vacío, usa public/products.json y el login de demostración.
VITE_API_URL=
```

## Estructura

```text
tienda-sena/
├── public/
│   └── products.json
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── CatalogFilters.jsx
│   │   ├── CatalogGrid.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CartPanel.jsx
│   │   ├── CounterDemo.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Catalog.jsx
│   │   ├── Favorites.jsx
│   │   ├── Login.jsx
│   │   └── Profile.jsx
│   ├── services/
│   │   ├── productsApi.js
│   │   ├── authApi.js
│   │   └── api.js
│   ├── store/
│   │   ├── useProductStore.js
│   │   ├── useCartStore.js
│   │   ├── useFavoritesStore.js
│   │   ├── useUiStore.js
│   │   ├── useAuthStore.js
│   │   └── useCounterStore.js
│   ├── utils/format.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── docs/
│   ├── Respuestas_Taller_Zustand.pdf
│   ├── respuestas.html
│   ├── arbol-componentes.svg
│   ├── guia-devtools.md
│   └── pull-request.md
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## Manejo de estado

### Principios

1. **Un store por dominio.** Productos, carrito, favoritos, UI, autenticación y contador tienen archivos separados.
2. **Selectores por dato.** Los componentes se suscriben a lo que usan; no se llama `useStore()` sin selector.
3. **Acciones dentro del store.** La lógica de negocio vive en el store, no dispersa en los componentes.
4. **Inmutabilidad.** Se usan spread, `map` y `filter`; nunca `push`, `splice` ni asignaciones directas.
5. **Persistencia selectiva.** `persist` se usa solo para lo que debe sobrevivir, con `partialize`.
6. **`useState` para lo local.** Lo que solo usa un componente no va al store.
7. **`loading` y `error`** en las acciones asíncronas.
8. **Sin Providers.** Zustand no necesita envolver la aplicación.

### Stores

| Store | Archivo | Estado | Acciones | Persistencia | Consumidores |
| --- | --- | --- | --- | --- | --- |
| `useProductStore` | `src/store/useProductStore.js` | `products`, `loading`, `error`, `search`, `category` | `fetchProducts`, `setSearch`, `setCategory`, `clearFilters` | No | `Catalog`, `CatalogFilters`, `CatalogGrid` |
| `useCartStore` | `src/store/useCartStore.js` | `items` (`id`, `name`, `price`, `qty`) | `addItem`, `updateQty`, `removeItem`, `clearCart`, `totalItems`, `totalPrice` | Sí, `tienda-sena-cart` | `ProductCard`, `Navbar`, `CartPanel` |
| `useFavoritesStore` | `src/store/useFavoritesStore.js` | `favorites` | `toggleFavorite`, `isFavorite`, `clearFavorites` | Sí, `tienda-sena-favorites` | `ProductCard`, `Favorites` |
| `useUiStore` | `src/store/useUiStore.js` | `theme`, `isCartOpen` | `toggleTheme`, `setTheme`, `openCart`, `closeCart`, `toggleCart` | Sí, solo `theme` | `App`, `Navbar`, `CartPanel` |
| `useAuthStore` | `src/store/useAuthStore.js` | `user`, `token`, `loading`, `error` | `login`, `logout`, `clearError`, `isAuthenticated` | Sí, `user` y token demo | `Navbar`, `Login`, `Profile`, `ProtectedRoute` |
| `useCounterStore` | `src/store/useCounterStore.js` | `count` | `increment`, `decrement`, `reset` | No | `CounterDisplay`, `CounterButtons` |

### `useProductStore` · catálogo y filtros

- `fetchProducts(force)` evita peticiones duplicadas y conserva el catálogo entre navegaciones.
- Consulta `{VITE_API_URL}/products` o, si no hay variable, `public/products.json`.
- Maneja `loading`, `error` y un reintento desde la interfaz.
- `search` y `category` son globales porque el input está en `CatalogFilters` y la lista en `CatalogGrid`.
- `selectFilteredProducts` es un selector derivado que calcula la lista filtrada sin guardar una copia en el estado.
- `CatalogGrid` usa `useShallow(selectFilteredProducts)` porque el selector devuelve un arreglo nuevo en cada cálculo; `useShallow` evita renders innecesarios y ciclos infinitos.

```js
export const selectFilteredProducts = (state) => {
  const term = state.search.trim().toLowerCase()

  return state.products.filter((product) => {
    const matchesCategory =
      state.category === 'Todas' || product.category === state.category
    const searchable =
      `${product.name} ${product.description} ${product.category}`.toLowerCase()
    return matchesCategory && (!term || searchable.includes(term))
  })
}
```

### `useCartStore` · carrito

- `addItem(product)` incrementa `qty` si el producto ya existe o agrega un item nuevo.
- `updateQty(id, qty)` normaliza a cero o positivo y elimina los items que quedan en cero.
- `removeItem(id)` y `clearCart()` completan el CRUD.
- `totalItems()` y `totalPrice()` son valores derivados para usar **fuera** de componentes; los componentes usan selectores primitivos (`selectTotalItems`, `selectSubtotal`).
- `persist` guarda solo `items` (`partialize`) bajo la clave `tienda-sena-cart`.
- `devtools` con nombre `CartStore` y acciones nombradas para que Redux DevTools muestre un historial legible.

```js
export const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (product) =>
          set(
            (state) => {
              const exists = state.items.find((item) => item.id === product.id)
              if (exists) {
                return {
                  items: state.items.map((item) =>
                    item.id === product.id
                      ? { ...item, qty: item.qty + 1 }
                      : item,
                  ),
                }
              }
              return { items: [...state.items, { ...product, qty: 1 }] }
            },
            false,
            'cart/addItem',
          ),
      }),
      { name: 'tienda-sena-cart', partialize: (s) => ({ items: s.items }) },
    ),
    { name: 'CartStore' },
  ),
)
```

### `useFavoritesStore` · favoritos

- `toggleFavorite(product)` agrega el producto completo o lo quita.
- `isFavorite(id)` es útil fuera de React o dentro de callbacks; la interfaz usa un selector booleano reactivo:
  `useFavoritesStore((s) => s.favorites.some((item) => item.id === product.id))`.
- Persiste en `tienda-sena-favorites`.
- La página `/favoritos` reutiliza `ProductCard`; al quitar el corazón, la tarjeta desaparece de la lista.

### `useUiStore` · tema y panel

- `theme` (`light` / `dark`) se aplica al `<body>` con un `useEffect` en `App` y se persiste con `partialize`.
- `isCartOpen` es estado de UI compartido por `Navbar` y `CartPanel`, pero **no se persiste**: al recargar, el panel debe empezar cerrado.
- `index.html` incluye un script que aplica el tema antes de montar React para evitar el destello al recargar.

### `useAuthStore` · sesión

- `login({ email, password })` es una acción asíncrona que maneja `loading` y `error` y devuelve `true`/`false`.
- Con `VITE_API_URL` hace un `POST` real; sin ella usa las credenciales demo y simula la latencia.
- `logout()` limpia `user`, `token` y `error`.
- `isAuthenticated()` devuelve `Boolean(get().token)`.
- Persiste `user` y `token` con `partialize`. El token es **ficticio**; en producción se recomienda una cookie `httpOnly` emitida por el backend.
- `ProtectedRoute` lee solo `token` y redirige a `/login` conservando el destino en `location.state.from`.

```jsx
export default function ProtectedRoute() {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
```

### `useCounterStore` · contador

- Store mínimo para demostrar el mecanismo: `count`, `increment`, `decrement`, `reset`.
- `CounterDisplay` selecciona `count`; `CounterButtons` selecciona solo las acciones, por lo que no se vuelve a renderizar cuando el contador cambia.

### Persistencia

| Clave | Qué guarda | Store |
| --- | --- | --- |
| `tienda-sena-cart` | `items` y cantidades | `useCartStore` |
| `tienda-sena-favorites` | favoritos completos | `useFavoritesStore` |
| `tienda-sena-ui` | solo `theme` | `useUiStore` |
| `tienda-sena-auth` | `user` y token demo | `useAuthStore` |

No se guardan contraseñas, datos de pago ni información sensible. El token de la práctica es ficticio y se documenta como tal.

### DevTools

El carrito está envuelto en `devtools`:

```js
export const useCartStore = create(
  devtools(persist(/* ... */), { name: 'CartStore' }),
)
```

Las acciones usan el tercer argumento de `set`:

```js
set(nextState, false, 'cart/addItem')
set(nextState, false, 'cart/updateQty')
set({ items: [] }, false, 'cart/clear')
```

Instala la extensión **Redux DevTools** en Chrome o Firefox, abre la app, agrega productos y revisa el store `CartStore`. La guía está en [`docs/guia-devtools.md`](docs/guia-devtools.md).

### Estado local vs. global

| Dato | Decisión | Por qué |
| --- | --- | --- |
| Texto de búsqueda y categoría | Global (`useProductStore`) | El input y la lista son componentes distintos. |
| Carrito | Global (`useCartStore` + persist) | Lo usan tarjeta, navbar y panel; debe sobrevivir a la recarga. |
| Favoritos | Global (`useFavoritesStore` + persist) | Tarjeta y página deben ver el mismo estado. |
| Tema | Global (`useUiStore` + persist) | Afecta todo el documento y se conserva entre sesiones. |
| Panel del carrito abierto | Global de UI, sin persist | Lo comparten navbar y panel, pero debe iniciar cerrado. |
| Usuario y token | Global (`useAuthStore` + persist) | Sesión transversal y ruta protegida. |
| Visibilidad de la contraseña | Local (`useState`) | Solo la necesita el formulario de login. |

## Uso fuera de componentes

`src/services/api.js` muestra cómo leer el token con `getState()` y cerrar la sesión ante un `401`:

```js
export async function apiFetch(path, options = {}) {
  const token = useAuthStore.getState().token
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  })
  if (res.status === 401) useAuthStore.getState().logout()
  return res
}
```

## Documentación

- PDF con respuestas: [`docs/Respuestas_Taller_Zustand.pdf`](docs/Respuestas_Taller_Zustand.pdf)
- Fuente del PDF: [`docs/respuestas.html`](docs/respuestas.html)
- Árbol de componentes: [`docs/arbol-componentes.svg`](docs/arbol-componentes.svg)
- Guía de Redux DevTools: [`docs/guia-devtools.md`](docs/guia-devtools.md)
- Descripción del Pull Request: [`docs/pull-request.md`](docs/pull-request.md)

## Git y entrega

El repositorio se trabaja en la rama `feature/zustand` y se integra a `main` con un merge `--no-ff`. La descripción del PR está en `docs/pull-request.md`. El entorno de construcción no tiene remoto de GitHub, por lo que la publicación y la revisión por otro integrante deben hacerse desde la cuenta del grupo.

## Limitaciones

- El catálogo usa `public/products.json` para funcionar sin backend. `VITE_API_URL` permite conectar un backend Express/Laravel real sin cambiar los stores.
- El login es una simulación cuando no hay API. El token no es un JWT real ni debe usarse en producción.
- No se procesan pagos ni se envían pedidos.
- El criterio 10 de la lista de chequeo (PR revisado) queda pendiente de la revisión de otro integrante al publicar el repositorio.

## Referentes

- Poimandres. (2026). *Zustand — Documentación oficial*. https://zustand.docs.pmnd.rs
- Poimandres. (2026). *Zustand — Repositorio en GitHub*. https://github.com/pmndrs/zustand
- Meta Open Source. (2026). *React — Managing State*. https://react.dev/learn/managing-state
- Vite. (2026). *Guía de inicio*. https://vite.dev/guide/
- MDN. (2026). *Window: localStorage property*. https://developer.mozilla.org/es/docs/Web/API/Window/localStorage
