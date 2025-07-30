import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessagesInput from "./MessagesInput";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

// Helper to group messages by date
const groupMessagesByDate = (messages) => {
  const grouped = [];
  let lastDate = null;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  messages.forEach((msg) => {
    const msgDate = new Date(msg.createdAt).toDateString();

    if (msgDate !== lastDate) {
      let label = msgDate;
      if (msgDate === today) label = "Today";
      else if (msgDate === yesterday) label = "Yesterday";
      else
        label = new Date(msg.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });

      grouped.push({ type: "label", label });
      lastDate = msgDate;
    }

    grouped.push({ type: "message", ...msg });
  });

  return grouped;
};

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-500 text-lg border border-gray-300 rounded-lg">
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  if (isMessagesLoading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto border border-gray-300 rounded-lg">
      <ChatHeader />
      <div
        className="flex flex-1 flex-col gap-3 no-scrollbar overflow-auto"
        style={{
          padding: "15px",
          backgroundImage: `radial-gradient(#555 0.6px, transparent 0.6px)`,
          backgroundSize: "20px 20px",
          backgroundColor: "#fefefe",
        }}
      >
        {groupMessagesByDate(messages).map((item, index) => {
          if (item.type === "label") {
            return (
              <div
                key={`label-${index}`}
                className="text-center text-xs text-gray-500"
                style={{ margin: "8px 0px" }}
              >
                {item.label}
              </div>
            );
          }

          const msg = item;
          const isSentByMe = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id}
              className={`flex flex-col gap-1 ${isSentByMe ? "items-end" : "items-start"}`}
              ref={messageEndRef}
            >
              <div className={`flex items-end gap-3 ${isSentByMe ? "justify-end" : "justify-start"}`}>
                {!isSentByMe && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300">
                    <img
                      src={selectedUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[70%] text-sm relative flex flex-col ${
                    isSentByMe ? "bg-slate-900 text-white" : "bg-white border border-gray-300 text-black"
                  }`}
                  style={{
                    borderRadius: "18px",
                    padding: msg.image ? "10px" : "12px 16px",
                    gap: msg.text ? "8px" : "0",
                  }}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Sent"
                      className="max-w-[200px] rounded-lg"
                    />
                  )}
                  {msg.text && <p className="m-0">{msg.text}</p>}
                </div>

                {isSentByMe && (
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-300">
                    <img
                      src={authUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div
                className="text-xs opacity-60"
                style={{
                  marginLeft: isSentByMe ? "auto" : "50px",
                  marginTop: "2px",
                }}
              >
                {formatMessageTime(msg.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
      <MessagesInput />
    </div>
  );
};

export default ChatContainer;
