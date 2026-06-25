import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from '../lib/supabaseClient';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  role: 'admin' | 'customer' | 'guarantor';
  full_name: string;
  email: string;
  phone: string;
  cnic?: string;
  is_blacklisted?: boolean;
  manual_verification_status?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  useRealDb: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    cnic: string,
    role: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Helper: attempt Supabase connection test ─────────────────────────────────
// Makes a real HTTP fetch to the auth settings endpoint to verify connectivity
async function testSupabaseConnection(): Promise<boolean> {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: key },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // useRealDb starts as false; set to true only after a successful connection test
  const [useRealDb, setUseRealDb] = useState(false);
  const realDbRef = useRef(false); // sync ref so async callbacks see the latest value

  // ── Fetch Supabase profile row ────────────────────────────────────────────
  const fetchProfile = async (userId: string, supabaseUser?: User | null) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        console.log('[AuthContext] Profile fetched successfully:', data.email, data.role);
        setProfile(data as Profile);
        return data as Profile;
      }

      // Profile row not found — build a fallback from user metadata
      console.warn('[AuthContext] No profile row found for user', userId, '— building from metadata');
      const resolvedUser = supabaseUser || user;
      const meta = resolvedUser?.user_metadata || {};
      const fallbackProfile: Profile = {
        id: userId,
        role: (meta.role as Profile['role']) || 'customer',
        full_name: meta.full_name || meta.name || resolvedUser?.email?.split('@')[0] || 'User',
        email: resolvedUser?.email || '',
        phone: meta.phone || '',
        cnic: meta.cnic || '',
        is_blacklisted: false,
        manual_verification_status: 'pending',
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    } catch (err) {
      console.error('[AuthContext] fetchProfile error:', err);
      // Even on error, try to build a minimal profile so redirect works
      const resolvedUser = supabaseUser || user;
      if (resolvedUser) {
        const meta = resolvedUser.user_metadata || {};
        const emergencyProfile: Profile = {
          id: userId,
          role: (meta.role as Profile['role']) || 'customer',
          full_name: meta.full_name || resolvedUser.email?.split('@')[0] || 'User',
          email: resolvedUser.email || '',
          phone: meta.phone || '',
        };
        setProfile(emergencyProfile);
        return emergencyProfile;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ── Initialise auth on mount ──────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      if (!isSupabaseConfigured) {
        // No env credentials at all — use sandbox
        loadSandboxSession();
        setLoading(false);
        return;
      }

      // Credentials are present — test actual connectivity
      const connected = await testSupabaseConnection();

      if (!connected) {
        // Supabase unreachable — fall back to sandbox silently
        toast.warning('Supabase unreachable. Switched to offline sandbox mode.', {
          description: 'Data will be saved locally in your browser.',
          duration: 5000,
        });
        loadSandboxSession();
        setLoading(false);
        return;
      }

      // ✅ Connected — enable real Supabase auth
      setUseRealDb(true);
      realDbRef.current = true;

      // Check existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log('[AuthContext] Existing session found for:', session.user.email);
        setUser(session.user);
        await fetchProfile(session.user.id, session.user);
      } else {
        console.log('[AuthContext] No existing session found.');
        setLoading(false);
      }

      // Subscribe to future auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('[AuthContext] onAuthStateChange event:', event, session?.user?.email);
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id, session.user);
          } else {
            setUser(null);
            setProfile(null);
            setLoading(false);
          }
        }
      );

      return () => subscription.unsubscribe();
    };

    init();
  }, []);

  const loadSandboxSession = () => {
    const session = localStorage.getItem('installment_session');
    if (session) {
      try {
        const mockProfile: Profile = JSON.parse(session);
        setUser({ id: mockProfile.id, email: mockProfile.email } as User);
        setProfile(mockProfile);
      } catch {
        localStorage.removeItem('installment_session');
      }
    }
  };

  // ── Sign Up ───────────────────────────────────────────────────────────────
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone: string,
    cnic: string,
    role: string
  ) => {
    if (!realDbRef.current) {
      // ── Sandbox mode ──
      const profiles = await mockDb.getTable('profiles');
      if (profiles.some((p: any) => p.email === email)) {
        throw new Error('Email already registered.');
      }
      const newProfile: Profile = {
        id: Math.random().toString(36).substr(2, 9),
        role: role as Profile['role'],
        full_name: fullName,
        phone,
        cnic,
        email,
        is_blacklisted: false,
        manual_verification_status: 'pending',
      };
      await mockDb.insert('profiles', newProfile);
      localStorage.setItem('installment_session', JSON.stringify(newProfile));
      setUser({ id: newProfile.id, email: newProfile.email } as User);
      setProfile(newProfile);
      toast.success('Registered successfully in local sandbox!');
      return;
    }

    // ── Real Supabase auth ──
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, full_name: fullName, phone, cnic },
      },
    });

    if (error) {
      const msg = error.message || '';
      // Rate limit
      if (error.status === 429 || msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('email rate')) {
        throw new Error('Too many signup attempts. Please wait a few minutes and try again.');
      }
      // Email already registered
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('user already registered')) {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      // Duplicate phone or CNIC (unique constraint violation via trigger)
      if (msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('phone') || msg.toLowerCase().includes('cnic')) {
        throw new Error('Phone number or CNIC is already registered with another account.');
      }
      // Database trigger error
      if (msg.toLowerCase().includes('trigger_error') || msg.toLowerCase().includes('database error')) {
        throw new Error('Account setup failed. Please contact support.');
      }
      throw error;
    }

    // If email confirmations are disabled, user is auto-confirmed
    if (data.user && !data.session) {
      // Email confirmation required — this is normal
      return;
    }
  };

  // ── Sign In ───────────────────────────────────────────────────────────────
  const signIn = async (email: string, password: string) => {
    if (!realDbRef.current) {
      // ── Sandbox mode — password is ignored ──
      const profiles = await mockDb.getTable('profiles');
      const found = profiles.find((p: any) => p.email === email);
      if (!found) throw new Error('User not found. Please sign up first.');
      localStorage.setItem('installment_session', JSON.stringify(found));
      setUser({ id: found.id, email: found.email } as User);
      setProfile(found as Profile);
      toast.success('Logged in (sandbox mode).');
      return;
    }

    // ── Real Supabase auth ──
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Explicitly set user + profile immediately so redirect works
    // (onAuthStateChange may fire asynchronously / after this function returns)
    if (data.user) {
      console.log('[AuthContext] signIn success for:', data.user.email);
      setUser(data.user);
      await fetchProfile(data.user.id, data.user);
    }
    toast.success('Logged in successfully!');
  };

  // ── Sign Out ──────────────────────────────────────────────────────────────
  const signOut = async () => {
    if (realDbRef.current) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('installment_session');
    }
    setUser(null);
    setProfile(null);
    toast.success('Logged out successfully.');
  };

  // ── Reset Password ────────────────────────────────────────────────────────
  const resetPasswordForEmail = async (email: string) => {
    if (!realDbRef.current) {
      toast.info(`[Sandbox] Simulated reset link for: ${email}`);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?reset=true`,
    });
    if (error) throw error;
    toast.success('Password reset email sent! Check your inbox.');
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AuthContext.Provider
      value={{ user, profile, loading, useRealDb, signUp, signIn, signOut, resetPasswordForEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
