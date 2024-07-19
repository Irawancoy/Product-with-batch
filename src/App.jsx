import { useState } from 'react'
import Layouts from './layouts'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Layouts />
    </>
  )
}

export default App
