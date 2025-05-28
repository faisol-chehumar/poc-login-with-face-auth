'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuthComponent(props: P) {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState<boolean | null>(null);

    useEffect(() => {
      // Client-side route protection: redirect to /login if no auth-token cookie
      const hasToken = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth-token='));

      if (!hasToken) {
        router.replace('/login');
        setIsAuth(false);
      } else {
        setIsAuth(true);
      }
    }, [router]);

    // While checking auth, render nothing (or a loader)
    if (isAuth === null) {
      // Optionally show a loader here:
      // return <div>Loading...</div>;
      return null;
    }

    // If not authenticated, render nothing (redirect in progress)
    if (isAuth === false) {
      return null;
    }

    // Authenticated, render the protected component
    return <WrappedComponent {...props} />;
  };
}
