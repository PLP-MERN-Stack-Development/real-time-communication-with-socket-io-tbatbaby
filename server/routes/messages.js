import express from 'express';
import { getMessages, sendMessage, deleteMessage, reactToMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getMessages);
router.post('/', sendMessage);
router.delete('/:id', deleteMessage);
router.post('/:id/react', reactToMessage);

export default router;