import { Router } from 'express';
import {
  getMatches,
  getMatchById,
  getPitchReport,
  getMatchPrediction
} from '../controllers/matchController';

const router = Router();

router.get('/', getMatches);
router.get('/:id', getMatchById);
router.get('/:id/pitch-report', getPitchReport);
router.get('/:id/prediction', getMatchPrediction);

export default router;
