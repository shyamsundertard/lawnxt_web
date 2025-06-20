'use client';

import { useEffect } from 'react';
import { useAuthStore, useUserStore } from '@/store/useStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import LoadingSpinner from './LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setIsAuthenticated, setIsLoading, isLoading } = useAuthStore();
  const { setUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is authenticated');
        setIsAuthenticated(true);
        setUser({
          $id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
        });
        // Set the session cookie
        document.cookie = `current_session=${user.uid}; path=/; secure; samesite=strict`;
      } else {
        console.log('User is not authenticated');
        setIsAuthenticated(false);
        // Clear the session cookie
        document.cookie = 'current_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
        router.push('/login');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setIsAuthenticated, setIsLoading, setUser, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}