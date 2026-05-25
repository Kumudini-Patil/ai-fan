import { Router } from 'express';
import {
  addPlayer,
  updatePlayer,
  deletePlayer,
  addVenue,
  updateVenue,
  deleteVenue,
  addMatch,
  updateMatch,
  deleteMatch,
  updatePlayerStats,
  getUsers,
  getDashboardStats
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect);
router.use(authorize('admin'));

// Player management
router.post('/players', addPlayer);
router.put('/players/:id', updatePlayer);
router.delete('/players/:id', deletePlayer);

// Venue management
router.post('/venues', addVenue);
router.put('/venues/:id', updateVenue);
router.delete('/venues/:id', deleteVenue);

// Match management
router.post('/matches', addMatch);
router.put('/matches/:id', updateMatch);
router.delete('/matches/:id', deleteMatch);

// Stats management
router.put('/player-stats/:id', updatePlayerStats);

// User management
router.get('/users', getUsers);

// Dashboard
router.get('/stats', getDashboardStats);

export default router;
