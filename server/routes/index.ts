import { Router } from 'express';
import authRoutes from './authRoutes';
import matchRoutes from './matchRoutes';
import playerRoutes from './playerRoutes';
import teamRoutes from './teamRoutes';
import venueRoutes from './venueRoutes';
import adminRoutes from './adminRoutes';
import chatbotRoutes from './chatbotRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/matches', matchRoutes);
router.use('/players', playerRoutes);
router.use('/teams', teamRoutes);
router.use('/venues', venueRoutes);
router.use('/admin', adminRoutes);
router.use('/chatbot', chatbotRoutes);

export default router;
