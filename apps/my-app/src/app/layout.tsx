'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    function clearAuthTokenCookie() {
      document.cookie = 'auth-token=; Max-Age=0; path=/';
    }

    // Don't apply forced logout logic for login page itself!
    if (window.location.pathname !== '/login') {
      let shouldRedirect = false;

      if ('navigation' in window) {
        // Modern Navigation API (Chromium-based)
        // @ts-expect-error poc
        const navType = window.navigation.activation?.navigationType;
        if (
          navType === 'navigate' ||
          navType === 'reload' ||
          navType === 'replace' ||
          navType === 'push'
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
