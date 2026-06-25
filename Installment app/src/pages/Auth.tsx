import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card } from '../components/ui';
import {
  Mail, User, Phone, Shield, ArrowLeft, KeyRound,
  Sparkles, Eye, EyeOff, CreditCard, Lock
} from 'lucide-react';
import { toast } from 'sonner';

interface AuthProps {
  onAuthSuccess: (profile?: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const { signIn, signUp, resetPasswordForEmail, useRealDb } = useAuth();
  const [view, setView] = useState<'signin' | 'signup' | 'forgot' | 'verify'>('signin');
  const [isLoading, setIsLoading] = useState(false);

  // ── Sign In state ────────────────────────────────────────────────────────
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPw, setShowSignInPw] = useState(false);

  // ── Sign Up state ────────────────────────────────────────────────────────
  const [signUpForm, setSignUpForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    role: 'customer',
    password: '',
    confirmPassword: '',
  });
  const [showSignUpPw, setShowSignUpPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  // ── Forgot password state ─────────────────────────────────────────────────
  const [forgotEmail, setForgotEmail] = useState('');

  // ─────────────────────────────────────────────────────────────────────────
  const fieldClass =
    'w-full pl-10 pr-4 p-3 border border-slate-200 dark:border-slate-800 bg-card rounded-xl text-sm text-foreground focus:ring-2 focus:ring-ring outline-none transition-all';

  const getErrorMessage = (err: any): string => {
    if (!err) return 'An unknown error occurred.';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    if (err.message && typeof err.message === 'string') return err.message;
    if (err.error_description && typeof err.error_description === 'string') return err.error_description;
    if (err.msg && typeof err.msg === 'string') return err.msg;
    try {
      const str = JSON.stringify(err);
      if (str === '{}') return 'Connection timeout. Please check your internet or try again later.';
      return str;
    } catch {
      return 'An error occurred';
    }
  };

  // ── Handle Sign In ────────────────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) { toast.error('Please enter your email.'); return; }
    if (useRealDb && !signInPassword) { toast.error('Please enter your password.'); return; }

    setIsLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
      onAuthSuccess();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle Sign Up ────────────────────────────────────────────────────────
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, phone, cnic, role, password, confirmPassword } = signUpForm;

    if (!fullName || !email || !phone) {
      toast.error('Please fill in all required fields.'); return;
    }
    if (useRealDb) {
      if (!password) { toast.error('Password is required.'); return; }
      if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { toast.error('Passwords do not match.'); return; }
    }

    setIsLoading(true);
    try {
      await signUp(email, password, fullName, phone, cnic, role);
      if (useRealDb) {
        setView('verify');
      } else {
        onAuthSuccess();
      }
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Handle Forgot Password ────────────────────────────────────────────────
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) { toast.error('Please enter your email.'); return; }
    setIsLoading(true);
    try {
      await resetPasswordForEmail(forgotEmail);
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const goTo = (v: typeof view) => { setView(v); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="relative inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-100/60 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fintech Installment Solutions</span>
            {!useRealDb && (
              <span className="ml-1 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full text-[10px] font-semibold">
                Sandbox
              </span>
            )}
          </div>
        </div>

        <Card className="p-8 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-xl space-y-6">

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              EasyInstall
            </h1>
            <h2 className="text-xl font-extrabold text-foreground">
              {view === 'signin' && 'Sign in to your account'}
              {view === 'signup' && 'Create your account'}
              {view === 'forgot' && 'Reset your password'}
              {view === 'verify' && 'Verify your email'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {view === 'signin' && (
                <>
                  New to EasyInstall?{' '}
                  <button onClick={() => goTo('signup')} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Create a new account
                  </button>
                </>
              )}
              {view === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button onClick={() => goTo('signin')} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Sign in
                  </button>
                </>
              )}
              {(view === 'forgot' || view === 'verify') && (
                <button onClick={() => goTo('signin')} className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </button>
              )}
            </p>
          </div>

          {/* ── SIGN IN FORM ────────────────────────────────────────────── */}
          {view === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="signin-email"
                    type="email"
                    required
                    placeholder="e.g. customer@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="signin-password"
                    type={showSignInPw ? 'text' : 'password'}
                    required={useRealDb}
                    placeholder={useRealDb ? 'Enter your password' : 'Password (not needed in sandbox)'}
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className={`${fieldClass} pr-11`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowSignInPw(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showSignInPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me / Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  <span>Remember me</span>
                </label>
                <button type="button" onClick={() => goTo('forgot')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full justify-center">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              {!useRealDb && (
                <div className="text-center text-[10px] text-muted-foreground border-t border-slate-100 dark:border-slate-800/80 pt-4">
                  💡 Sandbox: use <code className="text-indigo-600 dark:text-indigo-400 font-bold">admin@installment.com</code> to log in as Admin.
                </div>
              )}
            </form>
          )}

          {/* ── SIGN UP FORM ─────────────────────────────────────────────── */}
          {view === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Full Name <span className="text-destructive">*</span></label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" required placeholder="e.g. Ali Khan" value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, fullName: e.target.value })}
                    className={fieldClass} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Email Address <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" required placeholder="e.g. customer@example.com" value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    className={fieldClass} />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Phone Number <span className="text-destructive">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" required placeholder="e.g. 03001234567" value={signUpForm.phone}
                    onChange={(e) => setSignUpForm({ ...signUpForm, phone: e.target.value })}
                    className={fieldClass} />
                </div>
              </div>

              {/* CNIC */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">CNIC Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="e.g. 3520112345671" value={signUpForm.cnic}
                    onChange={(e) => setSignUpForm({ ...signUpForm, cnic: e.target.value })}
                    className={fieldClass} />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Register As</label>
                <div className="relative">
                  <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select value={signUpForm.role} onChange={(e) => setSignUpForm({ ...signUpForm, role: e.target.value })}
                    className={`${fieldClass} font-semibold`}>
                    <option value="customer">Customer</option>
                    <option value="guarantor">Guarantor</option>
                    <option value="admin">Administrator (Demo)</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Password {useRealDb && <span className="text-destructive">*</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showSignUpPw ? 'text' : 'password'}
                    required={useRealDb}
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                    className={`${fieldClass} pr-11`}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowSignUpPw(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showSignUpPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  Confirm Password {useRealDb && <span className="text-destructive">*</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    required={useRealDb}
                    placeholder="Re-enter your password"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                    className={`${fieldClass} pr-11 ${
                      signUpForm.confirmPassword && signUpForm.confirmPassword !== signUpForm.password
                        ? 'border-destructive focus:ring-destructive'
                        : ''
                    }`}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirmPw(p => !p)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signUpForm.confirmPassword && signUpForm.confirmPassword !== signUpForm.password && (
                  <p className="text-xs font-semibold text-destructive">Passwords do not match</p>
                )}
              </div>

              <Button type="submit" disabled={isLoading} className="w-full justify-center mt-2">
                {isLoading ? 'Registering...' : 'Create Account'}
              </Button>
            </form>
          )}

          {/* ── FORGOT PASSWORD FORM ──────────────────────────────────────── */}
          {view === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" required placeholder="e.g. customer@example.com" value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)} className={fieldClass} />
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="w-full justify-center" icon={<KeyRound className="w-4 h-4" />}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          {/* ── EMAIL VERIFICATION SCREEN ─────────────────────────────────── */}
          {view === 'verify' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 border border-indigo-100/60 dark:border-indigo-900/60">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <p className="font-bold text-foreground">Check your inbox!</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A verification email has been sent to <strong>{signUpForm.email}</strong>.
                  Click the link in the email to activate your account, then sign in.
                </p>
              </div>
              <Button onClick={() => goTo('signin')} className="w-full justify-center">
                Proceed to Sign In
              </Button>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
};
