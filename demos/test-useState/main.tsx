import React from 'react'
import { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [count, setCount] = useState(100)
  return <div>
    {count}
  </div>
}
// function Child() {
//   return <div>child</div>
// }
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
