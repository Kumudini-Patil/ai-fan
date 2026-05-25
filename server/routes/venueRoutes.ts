import { Router } from 'express';
import {
  getVenues,
  getVenueById
} from '../controllers/venueController';

const router = Router();

router.get('/', getVenues);
router.get('/:id', getVenueById);

export default router;
