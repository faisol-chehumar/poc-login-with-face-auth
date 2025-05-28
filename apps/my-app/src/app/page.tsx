'// TODO: This page checks a non-HttpOnly auth-token cookie for client-side protection.';
'// This is NOT secure for production. Use HttpOnly cookies and server/middleware protection for real apps.';
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { withAuth } from '@/components/withAuth';

function Home() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Welcome to Home
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              You have successfully logged in!
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-12 bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Dashboard
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                This is your home dashboard. Add your application
                content here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Home);
