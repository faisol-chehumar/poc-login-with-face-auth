'use client';

import React from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

function SearchParamsWrapper({
  children,
  onAuthCheck,
}: {
  children: React.ReactNode;
  onAuthCheck: (
    status: string | null,
    username: string | null
  ) => void;
}) {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const username = searchParams.get('username');

  useEffect(() => {
    onAuthCheck(status, username);
  }, [status, username, onAuthCheck]);

  return <>{children}</>;
}

function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showContent, setShowContent] = useState(false);

  const handleAuthCheck = (
    status: string | null,
    username: string | null
  ) => {
    if (username && status === 'success') {
      setShowContent(true);
    }

    if (window.location.pathname !== '/login') {
      let shouldRedirect = false;

      if ('navigation' in window) {
        // Modern Navigation API (Chromium-based)
        // @ts-expect-error poc
        const navType = window.navigation.activation?.navigationType;
        console.log('navType', navType);
        if (
          navType === 'navigate' ||
          navType === 'reload' ||
          navType === 'replace' ||
          (navType === 'push' && !username && status !== 'success')
        ) {
          shouldRedirect = true;
        }
      } else {
        shouldRedirect = true;
      }

      if (shouldRedirect) {
        document.cookie = 'auth-token=; Max-Age=0; path=/';
        window.location.replace('/login');
        return;
      }
    }

    setShowContent(true);
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <React.Suspense fallback={<LoadingSpinner />}>
          <SearchParamsWrapper onAuthCheck={handleAuthCheck}>
            {showContent && children}
          </SearchParamsWrapper>
        </React.Suspense>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LayoutContent>{children}</LayoutContent>;
}
