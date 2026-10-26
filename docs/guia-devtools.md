# Evidencia de Redux DevTools

El store del carrito estÃ¡ conectado al middleware `devtools` con el nombre `CartStore` y acciones etiquetadas. Esta guÃ­a sirve para tomar la captura del ejercicio 6 de la actividad 3.3.

## Requisitos

- ExtensiÃ³n **Redux DevTools** instalada en Chrome o Firefox.
- La app corriendo con `npm run dev`.
- Al menos dos productos en el carrito para que el historial tenga variedad.

## Pasos

1. Abre `http://localhost:5173` y agrega dos productos distintos desde el catÃ¡logo.
2. Abre las herramientas de desarrollo con `F12` o `Ctrl + Shift + I`.
3. Busca la pestaÃ±a **Redux** (puede estar dentro de `Â»` si hay muchas pestaÃ±as).
4. En el selector de instancias elige **CartStore**. Si no aparece, recarga la pÃ¡gina con DevTools abierto.
5. En el panel izquierdo verÃ¡s el historial de acciones. Debes encontrar, como mÃ­nimo:

   ```text
   cart/addItem
   cart/addItem
   cart/updateQty
   cart/removeItem
   cart/clear
   ```

6. Abre el carrito desde la app, cambia una cantidad con `+` / `âˆ’`, elimina un producto y vacÃ­a el carrito. Observa cÃ³mo cada acciÃ³n agrega una entrada al historial.
7. Selecciona una acciÃ³n y revisa la pestaÃ±a **State** / **Diff** para ver el estado antes y despuÃ©s.
8. Toma la captura con la ventana del navegador y el panel de DevTools visibles. Guarda el archivo como:

   ```text
   docs/redux-devtools.png
   ```

## QuÃ© debe mostrar la captura

- La pestaÃ±a **Redux** abierta.
- La instancia **CartStore** seleccionada.
- El historial con acciones `cart/...` y sus nombres.
- El estado del carrito (`items`, cantidades) visible en el panel.
- Idealmente, la app de fondo con el carrito abierto.

## Nota

La captura es la Ãºnica evidencia que se toma manualmente, porque el panel de Redux DevTools es parte de las herramientas del navegador y no de la pÃ¡gina. Guarda la imagen en `docs/redux-devtools.png` para adjuntarla a la entrega.

Si no ves la pestaÃ±a, verifica que la extensiÃ³n estÃ© habilitada en modo desarrollador y que la app no estÃ© en una ventana de incÃ³gnito.

