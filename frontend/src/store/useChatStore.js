import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  selectedUsersHistory: [],
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get('/message/users');

      const sortedHistory = res.data.chatHistory.sort((a, b) => {
        return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
      });

      set({
        users: res.data.allUsers,
        selectedUsersHistory: sortedHistory,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const authUser = useAuthStore.getState().authUser;
  
    socket.on("newMessage", async (newMessage) => {
      const {
        selectedUser,
        messages,
        selectedUsersHistory,
      } = get();
  
      const isActiveChat =
        selectedUser &&
        (newMessage.senderId === selectedUser._id || newMessage.receiverId === selectedUser._id);
  
      if (isActiveChat) {
        set({ messages: [...messages, newMessage] });
      }
  
      const otherUserId =
        newMessage.senderId === authUser._id
          ? newMessage.receiverId
          : newMessage.senderId;
  
      let updatedHistory = [...selectedUsersHistory];
      let userIndex = updatedHistory.findIndex((u) => u._id === otherUserId);
  
      if (userIndex !== -1) {
        const oldUser = updatedHistory[userIndex];
  
        updatedHistory[userIndex] = {
          ...oldUser,
          lastMessage: newMessage.text || (newMessage.image ? "📷 Photo" : ""),
          lastMessageAt: newMessage.createdAt,
          unreadCount: newMessage.senderId !== authUser._id
            ? (oldUser.unreadCount || 0) + 1
            : oldUser.unreadCount || 0,
        };
  
        const [updatedUser] = updatedHistory.splice(userIndex, 1);
        updatedHistory.unshift(updatedUser);
      } else {
        // 🆕 User not in sidebar → fetch user details
        try {
          const res = await axiosInstance.get(`/user/${otherUserId}`);
          const newUser = res.data;
  
          updatedHistory.unshift({
            ...newUser,
            lastMessage: newMessage.text || (newMessage.image ? "📷 Photo" : ""),
            lastMessageAt: newMessage.createdAt,
            unreadCount: newMessage.senderId !== authUser._id ? 1 : 0,
          });
        } catch (error) {
          console.error("Failed to fetch new chat user:", error.message);
        }
      }
  
      set({ selectedUsersHistory: updatedHistory });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: async (user) => {
    if (!user) {
      set({ selectedUser: null });
      return;
    }

    const { selectedUsersHistory } = get();
    set({ selectedUser: user });

    try {
      await axiosInstance.post('/message/add-to-chat-history', {
        selectedUserId: user._id,
      });

      await axiosInstance.post(`/message/mark-read/${user._id}`);
    } catch (error) {
      toast.error("Failed to update chat state");
      console.error("Chat state update error:", error.message);
    }

    // ✅ Reset unread count when user is opened
    const updatedHistory = selectedUsersHistory.map((u) =>
      u._id === user._id ? { ...u, unreadCount: 0 } : u
    );

    set({ selectedUsersHistory: updatedHistory });
  },
}));
