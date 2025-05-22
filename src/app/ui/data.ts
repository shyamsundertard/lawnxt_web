import { Home, User, FileText, Settings, Users } from "lucide-react";

export const links = [
  {
    label: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    label: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    label: "User Management",
    icon: Users,
    path: "/management",
  },

  {
    label: "Cases",
    icon: FileText,
    path: "/cases",
  },

  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];
