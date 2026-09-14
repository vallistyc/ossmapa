import { Routes, Route } from 'react-router-dom'
import CustomCursor from './cmp/CustomCursor'
import Navbar from './cmp/Navbar'
import Home from './pages/Home'

function App() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-ink pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </>
  )
}

export default App
