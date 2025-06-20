import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { LogOut } from 'lucide-react';
import { useAuthStore, useCaseStore, useFirmStore, useUserStore } from '@/store/useStore';

export default function LogoutButton() {
  const { setIsAuthenticated } = useAuthStore();
  const { setCases } = useCaseStore();
  const { clearFirmData } = useFirmStore();
  const { setUser } = useUserStore();
  
  async function logout() {
    try {
      await signOut(auth);
      setCases([]);
      clearFirmData();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex items-center justify-center cursor-pointer text-lg gap-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-300 transition-colors w-full"
      >
        <LogOut className="text-2xl" />
        <span>Logout</span>
      </button>
    </form>
  );
}