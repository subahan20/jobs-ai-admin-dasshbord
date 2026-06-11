'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser, signupUser } from '../store/authSlice';
import { supabase } from '../lib/supabase';

const EyeIcon = ({ visible }) => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    {visible ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    )}
  </svg>
);

const inputCls =
  'w-full border border-zinc-200 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/20 transition-all bg-white';

export default function AuthScreen() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetMessages = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setEmail('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setAgreedToTerms(false);
    resetMessages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    if (activeTab === 'signup') {
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreedToTerms) {
        setErrorMsg('Please agree to the Terms of Service.');
        return;
      }
    }

    setLoading(true);
    try {
      if (activeTab === 'signup') {
        const resultAction = await dispatch(
          signupUser({ email: email.trim(), password })
        );
        if (signupUser.rejected.match(resultAction)) {
          setErrorMsg(resultAction.payload || 'Signup failed.');
        } else if (resultAction.payload?.needsConfirmation) {
          setSuccessMsg(
            resultAction.payload.message || 'Check your email to confirm your account.'
          );
        }
      } else {
        const resultAction = await dispatch(
          loginUser({ email: email.trim(), password })
        );
        if (loginUser.rejected.match(resultAction)) {
          setErrorMsg(resultAction.payload || 'Invalid login credentials.');
        }
      }
    } catch (err) {
      setErrorMsg(err?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    resetMessages();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setErrorMsg(err?.message || 'Google sign-in failed.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0eef8] px-4 py-10 sm:py-12 overflow-hidden">
      <div className="w-full max-w-[480px] h-[min(720px,calc(100dvh-5rem))] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden shrink-0">

        <div className="px-10 pt-6 pb-0 shrink-0 flex flex-col items-center">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[#22c55e] flex items-center justify-center shadow shadow-[#22c55e]/30">
              <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <span className="text-base font-extrabold tracking-tight text-zinc-900">
              JobHunt<span className="text-[#22c55e]">10x</span><span className="text-zinc-400">.a</span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-zinc-900 text-center leading-tight">
            Get Hired 10X Faster
          </h1>
          <p className="text-sm text-zinc-400 text-center mt-1.5 leading-snug">
            {activeTab === 'login'
              ? 'Optimized job searching for modern pros'
              : 'Join thousands of ambitious candidates using AI to land their dream role.'}
          </p>

          <div className="flex w-full mt-5 border-b border-zinc-200">
            <button
              type="button"
              onClick={() => switchTab('login')}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'login'
                  ? 'text-[#22c55e] border-b-2 border-[#22c55e]'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchTab('signup')}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                activeTab === 'signup'
                  ? 'text-[#22c55e] border-b-2 border-[#22c55e]'
                  : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto auth-scroll-hidden px-10 pt-4 pb-5 flex flex-col items-center">

          {errorMsg && (
            <div className="w-full mt-3 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2 text-[11px] font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="w-full mt-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg px-3 py-2 text-[11px] font-medium">
              {successMsg}
            </div>
          )}

          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleSignIn}
            className="w-full mt-4 flex items-center justify-center gap-2.5 border border-zinc-200 rounded-lg py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="w-full flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest whitespace-nowrap">
              {activeTab === 'login' ? 'OR LOGIN WITH EMAIL' : 'OR'}
            </span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="w-full flex flex-col gap-3">
            {activeTab === 'signup' && (
              <div>
                <label htmlFor="full-name" className="text-[12px] font-semibold text-zinc-700 block mb-1">
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  autoComplete="off"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={inputCls}
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="text-[12px] font-semibold text-zinc-700 block mb-1">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={activeTab === 'login' ? 'alex@company.com' : 'john@example.com'}
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="auth-password" className="text-[12px] font-semibold text-zinc-700">
                  Password
                </label>
                {activeTab === 'login' && (
                  <button type="button" className="text-[12px] text-[#22c55e] font-semibold hover:underline">
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            {activeTab === 'signup' && (
              <>
                <div>
                  <label htmlFor="confirm-password" className="text-[12px] font-semibold text-zinc-700 block mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputCls} pr-10`}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      <EyeIcon visible={showConfirmPassword} />
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 accent-[#22c55e] shrink-0"
                  />
                  <span className="text-[11px] text-zinc-500 leading-snug">
                    I agree to the{' '}
                    <a href="#" className="text-[#22c55e] font-semibold hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#22c55e] font-semibold hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-white font-bold text-sm py-2.5 rounded-lg shadow-md shadow-[#22c55e]/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : activeTab === 'login' ? (
                'Login'
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <p className="text-[13px] text-zinc-400 mt-4 text-center">
            {activeTab === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className="text-[#22c55e] font-bold hover:underline"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-[#22c55e] font-bold hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </div>

        <div className="bg-[#f5f5fa] border-t border-zinc-100 px-8 py-3 flex items-center gap-2 shrink-0">
          <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[11px] text-zinc-400">
            Admin? Use your authorized email to access the Admin Panel.
          </span>
        </div>

        <div
          className="h-1 w-full shrink-0"
          style={{
            background: 'linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6)',
          }}
        />
      </div>
    </div>
  );
}
