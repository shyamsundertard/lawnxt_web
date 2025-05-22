"use client";
import clsx from "clsx";
import { links } from "./data";
import { useEffect, useState } from "react";
import { ImHammer2 } from "react-icons/im";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { account } from "../lib/client/appwrite";
import { useAuthStore, useCaseStore, useFirmStore, useUserStore } from "@/store/useStore";

const Sidebar = () => {
  const [active, setActive] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  const { setIsAuthenticated } = useAuthStore();
  const { setCases } = useCaseStore();
  const { clearFirmData } = useFirmStore();
  const { setUser } = useUserStore();
 
    const logoutUser = async () => {
  
      await account.deleteSession("current");

      setCases([]);
      clearFirmData();
      setUser(null);

      document.cookie = 'current_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';

      setIsAuthenticated(false);
      router.push('./login');
  
    };
  // const {user} = useUserStore();

  useEffect(() => {
    const path = pathname.split("/")[1];
    setActive(path);
  }, [pathname]);

  return (
    <aside className="lg:w-[250px] md:w-[220px] fixed md:block hidden top-0 left-0 h-full bg-white border-r shadow-md">
      <div className="flex flex-col justify-between h-full p-6 gap-6">
        {/* Profile Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4 p-2 text-xl">
            <ImHammer2 className="text-2xl" />
            <h1 className="lg:text-3xl text-2xl font-bold">LawNXT</h1>
          </div>

          {/* Navigation Links */}
          <nav className="pt-8">
            <ul className="flex flex-col gap-2">
              {links.map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.path}
                    className={clsx(
                      "flex items-center text-lg gap-3 px-4 py-3 rounded-md transition-colors",
                      active === link.path.split("/")[1]
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-300"
                    )}
                  >
                    <div>
                      <link.icon className="text-2xl" />
                    </div>
                    <span className="text-nowrap">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout Section */}
        <ul>
          <li
            onClick={logoutUser}
            className="flex items-center cursor-pointer text-lg gap-3 px-4 py-3 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
          >
            <LogOut className="text-2xl" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
