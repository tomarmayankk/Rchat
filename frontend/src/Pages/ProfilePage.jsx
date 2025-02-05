import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Pencil } from 'lucide-react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);


  const handleImageUpload = async (e) => {
    const file = await e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image)
      await updateProfile({profilePic: base64Image});
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-[638px]">
      <div className='flex flex-col items-center justify-center bg-gray-50 rounded-md shadow-xl w-96 h-[500px] gap-12'>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-600">Update your profile</p>
        
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

        <p className="text-sm mt-3 text-gray-600 text-center">
          {isUpdatingProfile ? "Uploading..." : "Click on edit icon to update your profile"}
        </p>

        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">{authUser?.fullName || "John Doe"}</p>
          <p className="text-gray-500">{authUser?.email || "johndoe@example.com"}</p>
          <div className='flex flex-row gap-2'>
          <p className='text-black font-semibold'>Member Since:</p>
          <p className="text-gray-500">{authUser?.createdAt?.split("T") [0] || "johndoe@example.com"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
