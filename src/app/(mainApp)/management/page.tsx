"use client";

import { useState } from "react";
import Select from "@/app/ui/forms/Select";
import { useFirmStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import CopyableText from "@/app/ui/components/CopyText";
import { FirmMember } from "@/app/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CgUndo } from "react-icons/cg";
import { HiOutlineSaveAs } from "react-icons/hi";
import axiosInstance from "@/app/lib/axiosInstance";
import toast from "react-hot-toast";
import { CircleCheckBig } from "lucide-react";

const image = '/lawnxt.svg'

interface ApiResponse {
  message: string;
}

export default function UsersManagement({}) {
  const { userRole, currentFirm, firmMembers } = useFirmStore();
  const [users, setUsers] = useState<FirmMember[]>(firmMembers);
  const [originalUsers, setOriginalUsers] = useState<FirmMember[]>(firmMembers);
  const [filter, setFilter] = useState<"All" | "Approved" | "Pending">("All");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (userRole === 'Viewer' || userRole === 'Editor') {
    router.back();
  }

  const updateUser = (id: string, field: "role" | "status", value: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.$id === id ? { ...user, [field]: value } : user))
    );
  };

  const remUsers = users.filter(doc => {return doc.role !== "Owner"})

  const filteredUsers =
    filter === "All" ? remUsers : remUsers.filter((user) => user.status === filter);

    const handleUndo = () => {
      setUsers(originalUsers);
    };

    const handleSave = async () => {
      setIsLoading(true);

      const originalMap = new Map(originalUsers.map(u => [u.$id, u]));

      const changes = users.filter((u,i) => {
        const original = originalMap.get(u.$id);
        return original && (u.role !== original.role || u.status !== original.status);
      });

      try {
        const savePromises = changes.map((user) => axiosInstance.put<ApiResponse>(`/api/firmMember/update/${user.$id}`,{
          role: user.role,
          status: user.status,
        })
      );

      await Promise.all(savePromises);
      toast.success("Changes saved successfully!", {
        icon: <CircleCheckBig/>,
      });

      setOriginalUsers([...users]);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while saving changes!");
      } finally {
        setIsLoading(false);
      }
    }

    const hasChanges = () => {
      for (let i = 0; i < users.length; i++) {
        const u1 = users[i];
        const u2 = originalUsers[i];
        if (u1.role !== u2.role || u1.status !== u2.status) {
          return true;
        }
      }
      return false;
    };    

  return (
    <div className="md:pt-8 pt-4 bg-white text-black min-h-screen">
      
      {(userRole === 'Owner' || userRole === 'Admin') && currentFirm && (
            <div className="bg-white mb-8">
              <h2 className="text-3xl font-semibold mb-2">Firm Management</h2>
              <div className="text-lg mb-1 flex flex-row items-center">
                <span className="font-medium pr-1">Invite Code:</span> {currentFirm.inviteCode} 
                <CopyableText text={currentFirm.inviteCode}/>
              </div>
              <p className="text-lg mb-1">
                <span className="font-medium">Your Role:</span> {userRole}
              </p>
              <div className="max-w-[200px]">
              <Button
                onClick={() => router.push(`/firm/${currentFirm.$id}/manage`)}
                variant='default'
              >Manage Firm</Button>
              </div>
            </div>
          )}

      <h1 className="text-2xl font-bold mb-6 ">Users Management</h1>

      {/* Filters */}
      <div className="flex justify-between items-center gap-4 mb-6 ">
        <div className="w-48">
          <Select
            options={[
              { value: "All", label: "All" },
              { value: "Approved", label: "Approved" },
              { value: "Pending", label: "Pending" },
            ]}
            onChange={(e) =>
              setFilter(e.target.value as "All" | "Approved" | "Pending")
            }
            value={filter}
          />
        </div>
        {hasChanges() && (
        <div className="flex flex-row gap-2">
          <Button
          variant='ghost'
          onClick={() => handleUndo()}
          >
            <CgUndo/>
            Undo
          </Button>
          <Button
          onClick={() => handleSave()}
          >
            {isLoading ? 'Saving...' : <>
            <HiOutlineSaveAs />
            Save Changes
            </>}
            </Button>
        </div>
        )}
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center">Image</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Role</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.$id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Image
                    src={image}
                    width={20}
                    height={20}
                    alt={user.name}
                    className="w-10 h-10 rounded-full mx-auto"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <div className="w-48 mx-auto">
                    <Select
                      options={[
                        { value: "Admin", label: "Admin" },
                        { value: "Editor", label: "Editor" },
                        { value: "Viewer", label: "Viewer" },
                      ]}
                      onChange={(e) =>
                        updateUser(user.$id, "role", e.target.value)
                      }
                      value={user.role}
                    />
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <div className="w-48 mx-auto">
                    <Select
                      options={[
                        { value: "Approved", label: "Approved" },
                        { value: "Pending", label: "Pending" },
                      ]}
                      onChange={(e) =>
                        updateUser(user.$id, "status", e.target.value)
                      }
                      value={user.status}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
