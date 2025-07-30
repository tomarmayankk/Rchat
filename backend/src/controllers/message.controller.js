import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
  
      const currentUser = await User.findById(loggedInUserId)
        .populate("chatHistory", "-password")
        .select("chatHistory");
  
      const historyWithLastMessages = await Promise.all(
        currentUser.chatHistory.map(async (chatUser) => {
          const lastMessage = await Message.findOne({
            $or: [
              { senderId: loggedInUserId, receiverId: chatUser._id },
              { senderId: chatUser._id, receiverId: loggedInUserId },
            ],
          })
            .sort({ createdAt: -1 })
            .limit(1);
  
          const unreadCount = await Message.countDocuments({
            senderId: chatUser._id,
            receiverId: loggedInUserId,
            read: false,
          });
  
          return {
            ...chatUser.toObject(),
            lastMessage: lastMessage?.text || (lastMessage?.image ? "📷 Photo" : ""),
            lastMessageAt: lastMessage?.createdAt || null,
            unreadCount, // ✅ Add this line
          };
        })
      );
  
      const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
  
      res.status(200).json({
        allUsers,
        chatHistory: historyWithLastMessages,
      });
    } catch (error) {
      console.error("error in getUserForSidebar controller", error.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
  
  

export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.error("error in getmessagescontroller", error.message)
        res.status(500).json({message: "internal server error"})
    }
}

export const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
  
      let imageUrl;
      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }
  
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });
      await newMessage.save();
  
      // ✅ Add sender to receiver's chat history
      const receiver = await User.findById(receiverId);
      if (!receiver.chatHistory.includes(senderId)) {
        receiver.chatHistory.push(senderId);
        await receiver.save();
      }
  
      // Emit to receiver socket if online
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("error in send message controller", error.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
  

// Add user to chat history
export const addToChatHistory = async (req, res) => {
    try {
      const userId = req.user._id;
      const { selectedUserId } = req.body;
  
      if (!selectedUserId) {
        return res.status(400).json({ message: "Selected user ID is required" });
      }
  
      // Prevent adding self to history
      if (userId.toString() === selectedUserId.toString()) {
        return res.status(400).json({ message: "Cannot add yourself to chat history" });
      }
  
      const user = await User.findById(userId);
  
      // Only add if not already in history
      if (!user.chatHistory.includes(selectedUserId)) {
        user.chatHistory.push(selectedUserId);
        await user.save();
      }
  
      res.status(200).json({ message: "User added to chat history successfully" });
    } catch (error) {
      console.error("Error in addToChatHistory controller", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // ✅ Mark messages from a sender as read
export const markMessagesAsRead = async (req, res) => {
    try {
      const userId = req.user._id; // The receiver (currently logged-in user)
      const { senderId } = req.params;
  
      if (!senderId) {
        return res.status(400).json({ message: "Sender ID is required" });
      }
  
      await Message.updateMany(
        {
          senderId,
          receiverId: userId,
          read: false,
        },
        { $set: { read: true } }
      );
  
      res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
      console.error("Error in markMessagesAsRead controller", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  