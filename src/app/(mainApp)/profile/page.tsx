'use client'
import Image from "next/image";
import { useUserStore } from "@/store/useStore";

const Profile = () => {
  const {user} = useUserStore();
  return (
    <div className="md:pt-8 pt-6">
      <div className="flex items-center  flex-col justify-center gap-4">
        <div className="h-36 w-36 aspect-square rounded-full ring-2 ring-black overflow-hidden">
          <Image
            src="/Avatar.svg"
            height={144}
            width={144}
            alt="Profile Image"
            loading="lazy"
            className="object-cover"
          />
        </div>
        <h1 className="text-lg">{user?.name}</h1>
        <p className="text-gray-500 text-sm">{user?.email}</p>
      </div>
    </div>
  );
};

export default Profile;
