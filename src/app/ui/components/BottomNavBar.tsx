"use client";

import Link from "next/link";
import { links } from "../data";
import { useFirmStore } from "@/store/useStore";

// const bottomLinks = [
//     {
//         label: "Dashboard",
//         icon: Home,
//         path: "/",
//     },
//     {
//         label: "Cases",
//         icon: FileText,
//         path: "/cases",
//     },
//     {
//         label: "Tasks",
//         icon: List,
//         path: "/tasks",
//       },
//       {
//         label: "Analytics",
//         icon: BarChart,
//         path: "/documents",
//       },
//       {
//         label: "Profile",
//         icon: User,
//         path: "/profile",
//       },
// ];


const BottomNavbar = () => {
    const {userRole} = useFirmStore();

    const bottomLinks = userRole === 'Owner' || userRole === 'Admin' ? links : links.filter(link => link.label !== 'User Management')
    return (
        <div className="bg-white fixed left-0 border-t bottom-0 w-full h-[80px] z-50 md:hidden text-white p-4">
            <div className="flex justify-between items-center w-full">
                {bottomLinks.map((link, index) => (
                    <Link
                    key={index}
                    href={link.path}
                    className="text-gray-600 hover:text-gray-800 flex items-center flex-col gap-1"
                    >
                    <link.icon className="text-2xl" />
                    <span className="text-xs" >{link.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BottomNavbar;