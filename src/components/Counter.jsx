import { useCounterStore } from '../store/useCounterStore'

export function CounterDisplay() {
  const count = useCounterStore((state) => state.count)

  return (
    <p className="counter-value">
      Valor actual: <strong>{count}</strong>
    </p>
  )
}

export function CounterButtons() {
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  const reset = useCounterStore((state) => state.reset)

  return (
    <div className="counter-buttons">
      <button type="button" className="button button-small" onClick={decrement}>
        −1
      </button>
      <button type="button" className="button button-small" onClick={increment}>
        +1
      </button>
      <button type="button" className="button button-ghost button-small" onClick={reset}>
        Reiniciar
      </button>
    </div>
  )
}
