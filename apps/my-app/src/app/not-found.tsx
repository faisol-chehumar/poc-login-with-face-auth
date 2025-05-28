'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  withSuspense,
  LoadingSpinner,
} from '@/components/LoadingSpinner';

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';

  return (
    <p className="mt-2 text-sm text-gray-600">
      {from
        ? `The page "${from}" was not found.`
        : 'The page you are looking for does not exist.'}
    </p>
  );
}

function NotFoundContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              404 - Page Not Found
            </h2>
            <React.Suspense fallback={<LoadingSpinner />}>
              <SearchParamsWrapper />
            </React.Suspense>
            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withSuspense(NotFoundContent);
