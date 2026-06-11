'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      exchangeCode(code);
    } else {
      setError('No authorization code found in URL.');
      setTimeout(() => router.replace('/'), 3000);
    }
  }, [searchParams, router]);

  const exchangeCode = async (code) => {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        throw error;
      }
      
      router.replace('/');
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err?.message || 'Authentication failed. Redirecting to home...');
      setTimeout(() => router.replace('/'), 4000);
    }
  };

  if (error) {
    return (
      <div className="w-full flex flex-col items-center gap-3 text-red-600">
        <svg className="w-8 h-8 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm font-semibold text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-4 text-zinc-600">
      <svg className="animate-spin h-10 w-10 text-[#22c55e]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <div className="text-center">
        <p className="text-sm font-semibold text-zinc-900">Completing Google authentication...</p>
        <p className="text-xs text-zinc-400 mt-1">Exchanging secure credentials with backend API</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-[#f0eef8] px-4 py-10 sm:py-12 overflow-hidden">
      <div className="w-full max-w-[480px] h-[min(720px,calc(100dvh-5rem))] flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden shrink-0">
        <div className="px-8 py-10 flex flex-col items-center">
          <Suspense
            fallback={
              <div className="w-full flex flex-col items-center gap-4 text-zinc-600">
                <svg className="animate-spin h-10 w-10 text-[#22c55e]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <p className="text-sm font-semibold">Loading authentication...</p>
              </div>
            }
          >
            <CallbackContent />
          </Suspense>
        </div>
        <div
          className="h-1 w-full shrink-0"
          style={{
            background: 'linear-gradient(to right,#ef4444,#f97316,#eab308,#22c55e,#3b82f6,#8b5cf6)',
          }}
        />
      </div>
    </main>
  );
}
