import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUserForSidebar, sendMessage, addToChatHistory, markMessagesAsRead   } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/users', protectRoute, getUserForSidebar)
router.get('/:id', protectRoute, getMessages)
router.post('/send/:id', protectRoute, sendMessage)
router.post('/add-to-chat-history', protectRoute, addToChatHistory)
router.post('/mark-read/:senderId', protectRoute, markMessagesAsRead);
export default router;