"use client";
import { useAuthStore } from '@/store/useStore';
import DashboardHomepage from '@/app/ui/components/DashboardHomepage';
import LoadingSpinner from '@/app/ui/components/LoadingSpinner';

export default function Dashboard() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <LoadingSpinner/>;
  }

  return <DashboardHomepage />;
}