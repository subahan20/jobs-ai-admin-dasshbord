'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

import { API_BASE_URL } from '../../config/api';

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
  }, [searchParams]);

  const exchangeCode = async (code) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OAuth exchange failed');

      // Save token session to LocalStorage
      const sessionPayload = {
        token: data?.session?.access_token,
        user: data?.user,
        expiresAt: Date.now() + (data?.session?.expires_in || 3600) * 1000
      };
      localStorage.setItem('admin_session', JSON.stringify(sessionPayload));

      // Redirect back to root dashboard
      router.replace('/');
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError(err?.message || 'Authentication failed. Redirecting to home...');
      setTimeout(() => router.replace('/'), 4000);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 text-red-400">
        <AlertCircle className="w-8 h-8 shrink-0 text-red-500" />
        <p className="text-sm font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-zinc-300">
      <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
      <div>
        <p className="text-sm font-semibold text-center">Completing Google authentication...</p>
        <p className="text-xs text-zinc-500 text-center mt-1">Exchanging secure credentials with backend API</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <main className="min-h-screen bg-zinc-950 flex justify-center items-center px-4 font-sans select-none relative">
      <div className="absolute top-[30%] left-[30%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[30%] w-[30%] h-[30%] bg-violet-600/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="w-full max-w-sm bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden z-10 flex justify-center">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center gap-4 text-zinc-300">
            <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
            <p className="text-sm font-semibold">Loading authentication components...</p>
          </div>
        }>
          <CallbackContent />
        </Suspense>
      </div>
    </main>
  );
}
