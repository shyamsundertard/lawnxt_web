'use client';

import { useEffect } from 'react';
import { useAuthStore , useUserStore} from '@/store/useStore';
import { account } from '@/app/lib/client/appwrite';
import LoadingSpinner from './LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setIsAuthenticated, setIsLoading, isLoading } = useAuthStore();
  const {setUser} = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currUser = await account.get();
        setIsAuthenticated(true);
        setUser({
          $id: currUser.$id,
          name: currUser.name,
          email: currUser.email,
        });
      } catch (error) {
        console.error({error: error})
        setIsAuthenticated(false);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [setIsAuthenticated, setIsLoading, setUser, router]);

  if (isLoading) {
    return<LoadingSpinner/>;
  }

  return <>{children}</>;
}