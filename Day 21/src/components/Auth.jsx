import { useState } from 'react'
import { supabase } from '../supabaseClient'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiUser, FiUploadCloud, FiEye, FiEyeOff, FiZap } from 'react-icons/fi'

function Auth({ onDemoLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast.error('Email not confirmed yet. Trying direct access...')
            // Offer fallback or option
            throw new Error('Please confirm your email or click "Quick Demo Access" below to enter directly!')
          }
          throw error
        }
        toast.success('Welcome back! 🎉')
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })
        
        if (error) {
          if (error.message.includes('rate limit')) {
            toast.error('Supabase Email Rate Limit reached. Entering via Quick Access...')
            onDemoLogin(email || 'user@cloudvault.app', fullName || 'Cloud User')
            return
          }
          throw error
        }

        // If session returned immediately (email confirmation turned off in Supabase)
        if (data?.session) {
          toast.success('Account created and logged in! 🎉')
        } else {
          // Attempt automatic sign in
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })
          if (!signInError && signInData?.session) {
            toast.success('Account created! Welcome to CloudVault 🎉')
          } else {
            toast.success('Account created! If email confirmation is required, please check your inbox or use Quick Access.')
          }
        }
      }
    } catch (error) {
      toast.error(error.message || 'Authentication error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Animated background elements */}
      <div className="auth-bg-orb auth-bg-orb-1"></div>
      <div className="auth-bg-orb auth-bg-orb-2"></div>
      <div className="auth-bg-orb auth-bg-orb-3"></div>
      <div className="auth-grid-overlay"></div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <FiUploadCloud size={32} />
            </div>
            <h1 className="auth-title">CloudVault</h1>
          </div>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back! Sign in to access your files.' : 'Create an account to start sharing files.'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
            id="login-tab"
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
            id="signup-tab"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <div className="input-icon">
                <FiUser size={18} />
              </div>
              <input
                id="fullname-input"
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={!isLogin}
                className="auth-input"
              />
            </div>
          )}

          <div className="input-group">
            <div className="input-icon">
              <FiMail size={18} />
            </div>
            <input
              id="email-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          <div className="input-group">
            <div className="input-icon">
              <FiLock size={18} />
            </div>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              id="toggle-password"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="auth-submit"
          >
            {loading ? (
              <div className="btn-spinner"></div>
            ) : isLogin ? (
              'Sign In'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="demo-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="demo-access-btn"
          onClick={() => onDemoLogin(email || 'user@cloudvault.app', fullName || 'Cloud User')}
          id="demo-access-btn"
        >
          <FiZap size={18} />
          <span>Quick Demo Access (Instant Login)</span>
        </button>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="auth-switch-btn"
              onClick={() => setIsLogin(!isLogin)}
              id="auth-switch"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth

