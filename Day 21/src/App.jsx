import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { Toaster } from 'react-hot-toast'

function App() {
  const [session, setSession] = useState(null)
  const [guestSession, setGuestSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session) setGuestSession(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleDemoLogin = (email, fullName) => {
    const mockSession = {
      user: {
        id: 'demo-user-cloudvault',
        email: email || 'user@cloudvault.app',
        user_metadata: {
          full_name: fullName || 'Hadia Ahmad',
        },
      },
    }
    setGuestSession(mockSession)
  }

  const activeSession = session || guestSession

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="loading-text">Initializing CloudVault...</p>
      </div>
    )
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(30, 30, 45, 0.95)',
            color: '#e2e8f0',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#e2e8f0',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#e2e8f0',
            },
          },
        }}
      />
      {!activeSession ? (
        <Auth onDemoLogin={handleDemoLogin} />
      ) : (
        <Dashboard
          session={activeSession}
          onLogout={() => {
            setGuestSession(null)
            supabase.auth.signOut()
          }}
        />
      )}
    </>
  )
}

export default App

