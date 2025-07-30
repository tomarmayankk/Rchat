import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    selectedUsersHistory,
    isUsersLoading,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  if (isUsersLoading) return <div>Loading...</div>;

  const filteredUsers = searchTerm.trim()
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : selectedUsersHistory;

  return (
    <div
      className="h-full w-full md:w-72 flex flex-col transition-all duration-200 gap-2 bg-white border border-gray-300 rounded-xl"
    >
      {/* User Profile Section */}
      <div className="w-full border-b border-gray-300" style={{ padding: "10px" }}>
        {authUser && (
          <Link to="/profile" className="flex justify-start items-center gap-4">
            <div>
            <img
              src={authUser?.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-300"
            />
            </div>
            <span className="flex flex-col gap-0">
            <p className="text-lg font-semibold text-gray-800">{authUser?.fullName || "John Doe"}</p>
            <p className="text-xs text-gray-500">@{authUser?.username||"@username"}</p>
            </span>
          </Link>
        )}
      </div>


      <div style={{padding: "10px"}}>
      {/* Chats Header */}
      <div className="w-full flex items-center justify-between">
        <span className="font-medium text-gray-500 hidden lg:block">Chats</span>
      </div>
      {/* Search Input */}
      <div style={{marginTop: "8px"}}>
        <input
          type="text"
          placeholder="Search or start a new chat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-100 rounded-2xl text-black outline-none"
          style={{ marginTop: "5px", padding: "10px 10px" }}
        />
      </div>

      {/* User List */}
      <div
        className="overflow-y-auto w-full space-y-2 no-scrollbar"
        style={{ marginTop: "10px" }}
      >
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleSelectUser(user)}
              style={{ padding: "10px", marginTop: "10px" }}
              className={`w-full flex items-center rounded-lg transition-colors gap-2 hover:bg-gray-200 ${
                selectedUser?._id === user._id ? "bg-gray-200" : ""
              }`}
            >
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full border border-gray-500"
                />

                {/* 🔴 Unread Count Badge */}
                {user.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full" style={{padding: "1px 5px"}}>
                    {user.unreadCount}
                  </div>
                )}
              </div>

              <div className="flex flex-col text-left flex-1 truncate">
                <span className="font-medium truncate text-black">
                  {user.fullName}
                </span>
                {user.lastMessage && (
                  <span className="text-sm text-gray-500 truncate">
                    {user.lastMessage.length > 30
                      ? user.lastMessage.slice(0, 30) + "..."
                      : user.lastMessage}
                  </span>
                )}
              </div>

              {user.lastMessageAt && (
                <div className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {new Date(user.lastMessageAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </button>
          ))
        ) : (
          <p className="text-sm text-gray-500" style={{ padding: "5px" }}>
            {searchTerm.trim() === ""
              ? "You have not selected any contacts yet."
              : "No matching contacts found."}
          </p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Sidebar;
