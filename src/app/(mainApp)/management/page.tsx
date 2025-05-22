"use client";

import { useState } from "react";
import Button from "@/app/ui/forms/Button";
import Select from "@/app/ui/forms/Select";
import { useFirmStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import CopyableText from "@/app/ui/components/CopyText";
import { FirmMember } from "@/app/types";
import Image from "next/image";

const image = '/lawnxt.svg'

export default function UsersManagement({}) {
  const { userRole, currentFirm, firmMembers } = useFirmStore();
  const [users, setUsers] = useState<FirmMember[]>(firmMembers);
  const [filter, setFilter] = useState<"All" | "Approved" | "Pending">("All");
  const router = useRouter();

  const updateUser = (id: string, field: "role" | "status", value: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.$id === id ? { ...user, [field]: value } : user))
    );
  };

  const filteredUsers =
    filter === "All" ? users : users.filter((user) => user.status === filter);

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
                text="Manage Firm"
                onClick={() => router.push(`/firm/${currentFirm.$id}/manage`)}
                variant="contained"
              />
              </div>
            </div>
          )}

      <h1 className="text-2xl font-bold mb-6 ">Users Management</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 ">
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
          />
        </div>
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
                        { value: "Owner", label: "Owner" },
                        { value: "Editor", label: "Editor" },
                        { value: "Viewer", label: "Viewer" },
                      ]}
                      onChange={(e) =>
                        updateUser(user.$id, "role", e.target.value)
                      }
                      placeholder={user.role}
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
                      placeholder={user.status}
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
