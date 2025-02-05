import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import MessagesInput from "./MessagesInput";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

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
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <ChatHeader />
      <div
        style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
        className="no-scrollbar"
      >
        {messages.map((msg) => {
          const isSentByMe = msg.senderId === authUser._id;

          return (
            <div
              key={msg._id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isSentByMe ? "flex-end" : "flex-start",
                gap: "3px",
              }}
              ref={messageEndRef}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: isSentByMe ? "flex-end" : "flex-start",
                  gap: "10px",
                }}
              >
                {/* Avatar (Left for received messages, right for sent messages) */}
                {!isSentByMe && (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid #ccc",
                    }}
                  >
                    <img
                      src={selectedUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  style={{
                    maxWidth: "70%",
                    borderRadius: "18px",
                    backgroundColor: isSentByMe ? "#007AFF" : "#E5E5EA",
                    color: isSentByMe ? "#fff" : "#000",
                    fontSize: "14px",
                    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.15)",
                    position: "relative",
                    padding: msg.image ? "5px" : "12px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: msg.text ? "8px" : "0",
                  }}
                >
                  {/* Image (if present) */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Sent Image"
                      style={{
                        maxWidth: "200px",
                        borderRadius: "12px",
                        display: "block",
                      }}
                    />
                  )}

                  {/* Text (if present) */}
                  {msg.text && <p style={{ margin: 0 }}>{msg.text}</p>}
                </div>

                {/* Avatar for sent messages */}
                {isSentByMe && (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid #ccc",
                    }}
                  >
                    <img
                      src={authUser.profilePic || "/avatar.png"}
                      alt="Profile"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
              </div>

              {/* Timestamp (Now properly positioned below message) */}
              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.6,
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
