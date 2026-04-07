'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-sm border border-outline/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black editorial-title text-on-surface uppercase">REM OS</h1>
          <p className="text-on-surface-variant text-sm mt-2">Control Center Brasil</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-sm text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs technical-label font-black text-on-surface uppercase mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-outline/50 rounded-sm bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs technical-label font-black text-on-surface uppercase mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-outline/50 rounded-sm bg-surface-container focus:outline-none focus:ring-pulse-cyan focus:border-pulse-cyan text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pulse-cyan text-white py-3 rounded-sm font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
