import './App.css'

import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <button
        className={`
          group text inline-block overflow-hidden rounded-full bg-green-300/30
          px-7 py-1.5 text-sm font-semibold text-green-700/70
          transition-transform
          hover:bg-green-500/70 hover:text-white
        `}
        type="button"
      >
        <FontAwesomeIcon icon={faCoffee} />
        <span
          className={`
            relative inline-block py-1.5 transition-transform
            group-hover:-translate-y-full
            before:absolute before:top-full before:py-1.5
            before:content-[attr(data-before)]
          `}
          data-before="Drink Coffee"
        >
          Send message
        </span>
      </button>
    </>
  )
}

export default App
