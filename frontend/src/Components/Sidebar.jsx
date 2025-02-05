import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const onlineUsers = [];
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <div>Loading... </div>;

  return (
    <div className="h-full w-72 border-r border-gray-300 flex flex-col transition-all duration-200 bg-gray-50 text-white gap-2" style={{padding: "10px"}}>
      <div className=" w-full p-5 flex items-center gap-2 ">
        <span className="font-medium hidden lg:block text-black">Contacts</span>
      </div>
      <div className="overflow-y-auto w-full space-y-2 no-scrollbar">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)} style={{padding: "5px", marginTop: "10px"}}
            className={`
              w-full p-3 flex items-center rounded-lg transition-colors gap-2
              hover:bg-gray-200
              ${
                selectedUser?._id === user._id
                  ? "bg-gray-300"
                  : ""
              }
            `}
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="w-full h-full object-cover rounded-full border border-gray-500"
              />
            </div>
            <div className="hidden lg:block text-left flex-1 truncate">
              <div className="font-medium truncate text-black">{user.fullName}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
