// TODO: This page checks a non-HttpOnly auth-token cookie for client-side protection.
// This is NOT secure for production. Use HttpOnly cookies and server/middleware protection for real apps.
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { withAuth } from '@/components/withAuth';

function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove auth-token cookie by setting it expired
    document.cookie =
      'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Profile
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Manage your account information
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Home
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              User Information
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Username
                </dt>
                <dd className="mt-1 text-sm text-gray-900">admin</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Role
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  Administrator
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  admin@example.com
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Status
                </dt>
                <dd className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Account Settings
            </h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Change Password
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
              </button>
              <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    Update Email
                  </span>
                  <span className="text-gray-400">→</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Profile);
