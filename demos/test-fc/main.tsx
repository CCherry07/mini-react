import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return <div>
    <Child></Child>
  </div>
}
function Child() {
  return <div>child</div>
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
)
