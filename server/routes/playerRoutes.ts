import { Router } from 'express';
import {
  getPlayers,
  getPlayerById,
  getPlayerStats,
  getPlayerForm,
  getPlayersByMatch
} from '../controllers/playerController';

const router = Router();

router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.get('/:id/stats', getPlayerStats);
router.get('/:id/form', getPlayerForm);
router.get('/match/:matchId', getPlayersByMatch);

export default router;
