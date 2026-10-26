import { useCounterStore } from '../store/useCounterStore'

function CounterDisplay() {
  const count = useCounterStore((state) => state.count)

  return (
    <p className="counter-value">
      Valor actual: <strong>{count}</strong>
    </p>
  )
}

function CounterButtons() {
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

export default function CounterDemo() {
  return (
    <div className="counter-demo">
      <CounterDisplay />
      <CounterButtons />
      <p className="hint">
        <code>CounterDisplay</code> y <code>CounterButtons</code> no se pasan
        props: comparten el mismo <code>useCounterStore</code>.
      </p>
    </div>
  )
}
