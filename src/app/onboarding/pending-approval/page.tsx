"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useStore';
import LogoutButton from '@/app/ui/LogoutButton';

export default function PendingApproval() {
  const router = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    const checkApprovalStatus = async () => {
      if (!user?.$id) return;
      
      const response = await fetch(`/api/getUserAndFirm?userId=${user.$id}`)
      const {member} = await response.json(); 
      if (member?.status === 'Approved') {
        router.push('/');
      }
    };

    const interval = setInterval(checkApprovalStatus, 30000);
    return () => clearInterval(interval);
  }, [user, router]);

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-6">Pending Approval</h1>
      <p className="mb-4">
        Your request to join the firm has been submitted.
      </p>
      <p>
        The firm owner will review your request and approve it shortly.
      </p>
      <p className="mt-6 text-gray-500">
        This page will automatically update when you&apos;re approved.
      </p>
      <LogoutButton/>
    </div>
  );
}