import { account } from '../lib/client/appwrite'
import { LogOut } from 'lucide-react'
import { useAuthStore, useCaseStore, useFirmStore, useUserStore } from '@/store/useStore';

export default function LogoutButton() {

  const { setIsAuthenticated } = useAuthStore();
  const { setCases } = useCaseStore();
  const { clearFirmData } = useFirmStore();
  const { setUser } = useUserStore();
  
  async function logout() {
    
    await account.deleteSession("current")
    setCases([]);
    clearFirmData();
    setUser(null);

    document.cookie = 'current_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';

    setIsAuthenticated(false);

    window.location.href = '/';
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
  )
}