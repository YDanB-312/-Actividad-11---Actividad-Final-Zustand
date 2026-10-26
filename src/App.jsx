import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import CartPanel from './components/CartPanel'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Catalog from './pages/Catalog'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { useUiStore } from './store/useUiStore'

export default function App() {
  const theme = useUiStore((state) => state.theme)

  useEffect(() => {
    document.body.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/perfil" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CartPanel />
    </>
  )
}
