'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Autenticazione fallita');
      }
    } catch (err) {
        console.error(err);
      setError('Errore di connessione');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 md:p-12">
        <div className="flex flex-col items-center justify-center mb-10 text-center">
          <a href="/" className="block mb-6 hover:opacity-80 transition">
            <div className="relative w-32 h-16">
                 <Image 
                    src="/assets/logo.png" 
                    alt="Sun-Fai Logo" 
                    fill
                    className="object-contain"
                 />
            </div>
          </a>
          <h1 className="text-3xl font-black text-black relative inline-block z-10">
            Area Riservata
            <span className="absolute bottom-1 left-0 w-full h-3 bg-sunfai-yellow -z-10 transform -rotate-1"></span>
          </h1>
          <p className="text-gray-500 mt-4 text-sm font-bold uppercase tracking-wider">Accesso Amministratori</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow focus:outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-sunfai-yellow focus:ring-1 focus:ring-sunfai-yellow focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sunfai-yellow text-black font-bold py-3 rounded-full hover:bg-yellow-400 transform hover:scale-[1.02] transition duration-300 uppercase tracking-wider shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center font-bold bg-red-50 py-2 rounded-lg animate-pulse">
              {error}
            </p>
          )}
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Sun-Fai Cooperativa
        </div>
      </div>
    </div>
  );
}
