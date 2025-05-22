"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useUserStore } from '@/store/useStore';
import Button from '@/app/ui/forms/Button';
import Image from 'next/image';
import LogoutButton from '@/app/ui/LogoutButton';
import LoadingSpinner from '@/app/ui/components/LoadingSpinner';

export default function FirmSelection() {
  const router = useRouter();
  const { user } = useUserStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkFirmMembership = async () => {
      if (!user?.$id) return;

      const response = await fetch(`/api/getUserAndFirm?userId=${user.$id}`);
      const { firm, member } = await response.json();
      
      if (firm && member?.status === 'Approved') {
        router.push('/');
      } else if (member?.status === 'Pending') {
        router.push('/onboarding/pending-approval');
      }
    };

    if (isAuthenticated) {
      checkFirmMembership();
    }
  }, [user, isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingSpinner/>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-800">
      <div className="absolute inset-0 md:hidden">
        <Image
          src='/lawnxt.svg'
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
          className="-z-20"
        />
      </div>

      <div className="flex flex-col md:flex-row bg-white/90 md:bg-white text-gray-800 rounded-lg border-2 overflow-hidden w-full md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg relative z-10">
        
        <div className="hidden md:flex flex-1">
          <Image
            src='/lawnxt.svg'
            alt="Firm Selection"
            className="h-full w-full object-cover"
            width={1000}
            height={1000}
            priority
          />
        </div>

        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center text-center">
          <h1 className="text-3xl font-semibold">Welcome to LawNXT</h1>
          <p className="text-gray-600 mt-2">Please choose how you&apos;d like to get started.</p>

          <div className="flex flex-col gap-6 mt-8 w-full">
            <Button
              onClick={() => router.push("/onboarding/create-firm")}
              text="Create a New Firm"
              variant="contained"
            />

            <Button
              onClick={() => router.push("/onboarding/join-firm")}
              text="Join Existing Firm"
              variant="outlined"
            />
            <LogoutButton/>
          </div>
        </div>
      </div>
    </div>
  );
}