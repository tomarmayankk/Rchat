import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  return (
    <div className="top-0" style={{padding: "10px", marginTop: "0px",}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-3">
          {/* Avatar */}
          <div className="avatar size-10">
            <div className="size-10 rounded-full relative flex items-center">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className=" w-10 h-10 rounded-full" />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium hidden lg:block text-black">{selectedUser.fullName}</h3>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;