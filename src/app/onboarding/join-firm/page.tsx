"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useStore';
import Input from '@/app/ui/forms/Input';
import Image from 'next/image';
import axiosInstance from '@/app/lib/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import { X } from 'lucide-react';
import LogoutButton from '@/app/ui/LogoutButton';

export default function JoinFirm() {
  const [inviteCode, setInviteCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string}>({});
  const router = useRouter();
  const { user } = useUserStore();

  const validateData = () => {
    const newErrors: { [key: string]: string } = {};

    if (!inviteCode) newErrors.inviteCode = "Invite Code is required!";
    if (!phone) newErrors.phone = "Contact number is required!";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateData()) {
      return;
    }

    try {
      setLoading(true);
      
      if (!user?.$id) throw new Error("User not authenticated");

      const response = await fetch(`/api/firm/getFirmByInviteCode?inviteCode=${inviteCode}`);
      const firm = await response.json();
      
      const role = 'Viewer';
      const status = 'Pending';

      await axiosInstance.post('/api/addFirmMember', {
        firmId: firm.$id, 
        userId: user.$id, 
        name: user.name, 
        email: user.email, 
        phone, 
        role, 
        status
      });
      
      router.push('/onboarding/pending-approval');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid invite code", {
        icon: <X/>
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-800 relative">
      <div className="absolute inset-0 md:hidden">
        <Image src='/lawnxt.svg' alt="Background" layout="fill" objectFit="cover" priority className="-z-20" />
      </div>

      <div className="flex flex-col md:flex-row bg-white/90 md:bg-white text-gray-800 rounded-lg border-2 overflow-hidden w-full md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg relative z-10">
        
        <div className="hidden md:flex flex-1">
          <Image src='/lawnxt.svg' alt="Background" className="h-full w-full object-cover" width={1000} height={1000} priority />
        </div>

        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-semibold text-center">Join a Law Firm</h1>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6 mb-2">
            <Input 
            label="Invite Code" 
            value={inviteCode} 
            isInvalid={!!errors.inviteCode}
            errorMessage={errors.inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="Enter 8-digit firm code" 
            variant='outlined'
            />

            <Input 
            label="Your Contact Number" 
            value={phone} 
            isInvalid={!!errors.phone}
            errorMessage={errors.phone}
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="10-digit mobile number" 
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Firm"}
            </button>
          </form>
          <LogoutButton/>
        </div>
      </div>
      <Toaster/>
    </div>
  );
}