import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  if (!selectedUser) return null;
  return (
    <div className="top-0 border-b border-gray-300" style={{ padding: "10px", marginTop: "0px" }}>
      <div className="flex items-center justify-between" style={{padding: "0px 20px"}}>
        {/* Avatar + Info */}
        <div className="flex items-center justify-center gap-3">
          <div className="avatar size-10">
            <div className="size-10 rounded-full relative flex items-center">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="w-10 h-10 rounded-full"
              />
            </div>
          </div>
          <div>
            <h3 className="font-medium hidden lg:block text-black">
              {selectedUser.fullName}
            </h3>
          </div>
        </div>
        {/* Close button */}
        <button onClick={() => setSelectedUser(null)} className="text-gray-600 cursor-pointer">
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
