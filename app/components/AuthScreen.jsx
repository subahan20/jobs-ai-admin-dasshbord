'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, signupUser } from '../store/authSlice';
import { Briefcase, Mail, Lock, LogIn, UserPlus, Sparkles, Loader2, AlertCircle, HelpCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

export default function AuthScreen() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        const resultAction = await dispatch(loginUser({ email: email.trim(), password }));
        if (loginUser.rejected.match(resultAction)) {
          setError(resultAction.payload || 'Invalid login credentials');
        }
      } else {
        const resultAction = await dispatch(signupUser({ email: email.trim(), password }));
        if (signupUser.fulfilled.match(resultAction)) {
          setMessage('Registration successful! If confirmation is required, check your email.');
          setIsLogin(true);
          setPassword('');
        } else {
          setError(resultAction.payload || 'Registration failed');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      setGoogleLoading(true);
      const res = await fetch(`${API_BASE_URL}/auth/google`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to get Google login link.');
        setGoogleLoading(false);
        return;
      }
      const data = await res.json();
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError('Google authentication URL not returned by backend.');
      }
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError(err?.message || 'Google authentication failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans selection:bg-violet-600/30 selection:text-violet-300 antialiased">
      {/* Background blurs */}
      <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden z-10">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />
        
        {/* Branding header */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl shadow-lg shadow-violet-900/30 mb-3">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            AI Job Sync Portal
          </h1>
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mt-1">
            Admin Authentication
          </p>
        </div>

        {/* System alerts */}
        {error && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-950/40 border border-red-900/40 text-red-200 text-xs mb-5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Authentication Error</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {message && (
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/40 text-emerald-200 text-xs mb-5 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400" htmlFor="auth-email">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-email"
                type="email"
                required
                placeholder="admin@jobsync.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-400" htmlFor="auth-password">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="auth-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-950/60 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-800/50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2 shadow-lg shadow-violet-900/20 hover:shadow-violet-900/35 transition-all text-sm mt-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : isLogin ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Administrator Account</span>
              </>
            )}
          </button>
        </form>

        {/* Separator line */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-zinc-800 flex-1" />
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">or</span>
          <div className="h-px bg-zinc-800 flex-1" />
        </div>

        {/* Google OAuth trigger */}
        <button
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2.5 bg-zinc-900/80 hover:bg-zinc-800 disabled:bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium rounded-lg px-4 py-2 transition-all text-sm"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* Toggle link */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors underline underline-offset-4"
          >
            {isLogin 
              ? "Don't have an administrator account? Sign up" 
              : 'Already have an administrator account? Log in'}
          </button>
        </div>

        {/* Developer Guidance Tip for Supabase */}
        {error && (
          <div className="mt-6 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-[11px] text-zinc-400 space-y-1.5 animate-in fade-in duration-500">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-violet-400 shrink-0" />
              Developer Troubleshooting:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-zinc-500">
              <li>
                Make sure you have registered this email first by clicking the <strong className="text-zinc-400">Sign up</strong> toggle link above.
              </li>
              <li>
                If you just signed up, you may need to click the confirmation link sent to your email inbox by Supabase.
              </li>
              <li>
                To bypass confirmation, go to your <strong className="text-zinc-400">Supabase Console → Authentication → Providers → Email</strong>, toggle <strong className="text-zinc-400">Confirm email</strong> to <strong className="text-zinc-400">OFF</strong>, and click <strong className="text-zinc-400">Save</strong>.
              </li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
