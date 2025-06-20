'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  withSuspense,
  LoadingSpinner,
} from '@/components/LoadingSpinner';

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  return (
    <p className="mt-2 text-center text-sm text-gray-600">
      {from ? `Please sign in to access ${from}` : null}
    </p>
  );
}

function LoginContent() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username === 'admin' && password === 'password') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        console.log('🚀 ~ handleSubmit ~ res:', res);

        if (res.ok) {
          const faceAuthUrl =
            process.env.NEXT_PUBLIC_FACE_AUTH_URL ||
            'http://localhost:3002';

          const callbackUrl = window.location.origin;
          const redirectUrl = new URL(faceAuthUrl);
          redirectUrl.searchParams.set('username', username);
          redirectUrl.searchParams.set('callback', callbackUrl);

          window.location.href = redirectUrl.toString();
        } else {
          setError('Login failed');
        }
      } catch (err) {
        console.error('Login error:', err);
        setError('Login error');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <React.Suspense fallback={<LoadingSpinner />}>
            <SearchParamsWrapper />
          </React.Suspense>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withSuspense(LoginContent);
