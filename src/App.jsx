import { Routes, Route, useLocation } from 'react-router-dom'
import CustomCursor from './cmp/CustomCursor'
import Navbar from './cmp/Navbar'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import BlogPost from './pages/BlogPost'
import PublicLeaderForm from './pages/PublicLeaderForm'
import AdminRegister from './pages/AdminRegister'
import PublicProgramForm from './pages/PublicProgramForm'
import LeaderProfile from './pages/LeaderProfile'
import PublicAchievementForm from './pages/PublicAchievementForm'
import { AchievementsPage, AspirationsPage, BlogPage, ProgramDetailPage, ProgramsPage } from './pages/PublicDataPages'
import { supabase } from './lib/supabase'
import { useEffect, useState } from 'react'

function App() {
  const location = useLocation()
  const [session, setSession] = useState(null)

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (location.pathname.startsWith('/admin')) {
    return (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin session={session} />} />
        <Route path="/admin/register" element={<AdminRegister session={session} />} />
        <Route path="/admin" element={<ProtectedAdminRoute session={session}><AdminDashboard session={session} /></ProtectedAdminRoute>} />
      </Routes>
    )
  }

  if (location.pathname === '/pendataan/pengurus') {
    return (
      <Routes>
        <Route path="/pendataan/pengurus" element={<PublicLeaderForm />} />
      </Routes>
    )
  }

  if (location.pathname === '/pendataan/proker') {
    return (
      <Routes>
        <Route path="/pendataan/proker" element={<PublicProgramForm />} />
      </Routes>
    )
  }

  if (location.pathname === '/pendataan/prestasi') {
    return <Routes><Route path="/pendataan/prestasi" element={<PublicAchievementForm />} /></Routes>
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-ink pt-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/proker" element={<ProgramsPage />} />
          <Route path="/proker/:id" element={<ProgramDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/aspirasi" element={<AspirationsPage />} />
          <Route path="/prestasi" element={<AchievementsPage />} />
          <Route path="/pengurus/:id" element={<LeaderProfile />} />
          <Route path="/pendataan/pengurus" element={<PublicLeaderForm />} />
        </Routes>
      </main>
    </>
  )
}

export default App
