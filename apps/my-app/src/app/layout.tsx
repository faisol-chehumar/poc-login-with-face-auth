'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showContent, setShowContent] = useState(false);
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const username = searchParams.get('username');

  useEffect(() => {
    function clearAuthTokenCookie() {
      document.cookie = 'auth-token=; Max-Age=0; path=/';
    }

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
        clearAuthTokenCookie();
        window.location.replace('/login');
        return;
      }
    }

    setShowContent(true);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {showContent && children}
      </body>
    </html>
  );
}
