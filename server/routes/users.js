import express from 'express';
import { getUsers, getUserProfile, updateProfile } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);

export default router;