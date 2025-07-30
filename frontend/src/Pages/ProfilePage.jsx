import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Pencil, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, logout, isLoggingOut } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = await e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="flex items-center justify-center w-full h-auto">
      <div className="flex flex-col items-center justify-center border border-gray-300 rounded-3xl w-96 h-auto gap-6" style={{padding: "20px 50px", marginTop: "20px"}}>
        <h1 className="text-2xl font-bold">Profile</h1>
        <div className="relative">
          <img
            src={selectedImage || authUser?.profilePic || "/avatar.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
          />
          <label className="flex items-center justify-center absolute bottom-2 right-2 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-400 w-10 h-10 shadow-md">
            <Pencil className="text-white text-lg" />
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        <p className="text-sm mt-1 text-gray-600 text-center">
          {isUpdatingProfile ? "Uploading..." : "Click on edit icon to update your profile picture"}
        </p>
        <div className="mt-4 text-left w-full px-4">
          <div className="mb-2">
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="text-lg font-semibold text-gray-800">{authUser?.fullName || "N/A"}</p>
          </div>

          <div className="mb-2">
            <p className="text-gray-500 text-sm">Username</p>
            <p className="text-base font-medium text-gray-700">@{authUser?.username || "N/A"}</p>
          </div>

          <div className="mb-2">
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-base font-medium text-gray-700">{authUser?.email || "N/A"}</p>
          </div>

          <div className="mb-2">
            <p className="text-gray-500 text-sm">Age</p>
            <p className="text-base font-medium text-gray-700">{authUser?.age || "N/A"}</p>
          </div>

          <div className="mb-2">
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="text-base font-medium text-gray-700">
              {authUser?.createdAt?.split("T")[0] || "N/A"}
            </p>
          </div>
        </div>

        <button
          className="flex items-center  justify-center gap-2 bg-red-400 hover:bg-red-500 text-white font-semibold rounded-2xl shadow-sm transition duration-150"
          onClick={logout}
          disabled={isLoggingOut}
          style={{padding: "6px 34px"}}
        >
          <LogOut size={18} />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
