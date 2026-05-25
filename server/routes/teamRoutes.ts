import { Router } from 'express';
import {
  generateTeam,
  saveTeam,
  getSavedTeams,
  getTeamById,
  deleteTeam,
  downloadTeamImage
} from '../controllers/teamController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/generate', generateTeam);
router.post('/save', protect, saveTeam);
router.get('/saved', protect, getSavedTeams);
router.get('/saved/:id', protect, getTeamById);
router.delete('/saved/:id', protect, deleteTeam);
router.get('/saved/:id/download', protect, downloadTeamImage);

export default router;
