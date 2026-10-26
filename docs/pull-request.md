# Pull Request · Integración de Zustand en Tienda SENA

> Texto listo para pegar en GitHub al abrir el PR de `feature/zustand` hacia `main` (o `develop`).

## Título

```text
feat: integra Zustand en Tienda SENA
```

## Resumen

Este PR incorpora el manejo de estado global con **Zustand 5** en la tienda de práctica del taller. Se eliminó el prop drilling del carrito, los favoritos, el tema, los filtros y la sesión; se añadieron selectores, acciones asíncronas, persistencia selectiva y una ruta protegida.

## Cambios principales

- Instalación de `zustand` y creación de `src/store/`.
- Seis stores por dominio:
  - `useProductStore`: catálogo, loading, error, búsqueda y categoría.
  - `useCartStore`: items, cantidades, totales, `persist` y `devtools`.
  - `useFavoritesStore`: favoritos persistentes.
  - `useUiStore`: tema persistente y panel del carrito.
  - `useAuthStore`: login asíncrono, logout, token e `isAuthenticated`.
  - `useCounterStore`: demostración del contador compartido.
- Catálogo asíncrono desde `public/products.json` o `VITE_API_URL/products`, con estado de carga, error y reintento.
- `CartPanel` con cantidades, eliminación, vaciado y total.
- Corazón de favoritos por producto y página `/favoritos`.
- Tema claro/oscuro aplicado al `body` y persistido con `partialize`.
- Filtros compartidos entre `CatalogFilters` y `CatalogGrid` con `useShallow`.
- Login y ruta `/perfil` protegida con `ProtectedRoute`.
- README con la sección **Manejo de estado**.
- Documentación: PDF de respuestas, árbol de componentes y guía de DevTools.

## Cómo probar

```bash
git checkout feature/zustand
npm install
npm run dev
```

1. Verifica que el catálogo cargue y que los filtros por texto/categoría funcionen.
2. Agrega productos, cambia cantidades, elimina y vacía el carrito. Recarga y comprueba la persistencia.
3. Marca favoritos, recarga y visita `/favoritos`.
4. Cambia el tema y recarga.
5. Entra a `/perfil` sin sesión: debe redirigir a `/login`.
6. Usa `demo@tienda.sena` / `sena2026` y confirma el acceso al perfil.
7. Abre Redux DevTools y revisa el historial del store `CartStore`.
8. Ejecuta `npm run build` y confirma que compila sin errores.

## Evidencia de DevTools

La captura del historial se guarda en `docs/redux-devtools.png` siguiendo `docs/guia-devtools.md`.

## Checklist

- [x] Zustand instalado y stores en `src/store/`.
- [x] Mínimo dos stores; `useAuthStore` completo.
- [x] Acción asíncrona con `loading` y `error`.
- [x] `persist` justificado y con `partialize`.
- [x] Componentes con selectores; sin `useStore()` sin argumentos.
- [x] Actualizaciones inmutables (`map`, `filter`, spread).
- [x] Prop drilling eliminado.
- [x] Ruta protegida leyendo el token del store.
- [x] README con “Manejo de estado”.
- [ ] Revisión por otro integrante (se completa al abrir este PR).

## Notas para quien revisa

- El catálogo local es una API simulada para que la práctica funcione sin backend. `VITE_API_URL` permite conectar el backend real.
- El login sin API es una simulación; el token es ficticio y no debe usarse en producción.
- No se procesan pagos ni se envían pedidos: es una práctica académica.
- El único punto pendiente del entorno es la revisión del PR por otro integrante, que no se puede hacer desde el repositorio local.

## Comandos de referencia

```bash
git checkout main
git merge --no-ff feature/zustand
git push origin main

# Con GitHub CLI, desde feature/zustand:
gh pr create --base main --head feature/zustand \
  --title "feat: integra Zustand en Tienda SENA" \
  --body-file docs/pull-request.md
```
