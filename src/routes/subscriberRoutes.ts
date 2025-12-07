import { Router } from 'express';
import {
  getAllSubscribers,
  getSubscriberCount,
  subscribe,
  unsubscribe,
} from '../controllers/subscriberController';
import { authenticatePublic, authenticateServiceRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { subscribeSchema, unsubscribeSchema } from '../validators/schemas';

const router = Router();

router.get('/', authenticateServiceRole, getAllSubscribers);
router.get('/count', authenticatePublic, getSubscriberCount);
router.post('/subscribe', authenticatePublic, validate(subscribeSchema), subscribe);
router.post('/unsubscribe', authenticatePublic, validate(unsubscribeSchema), unsubscribe);

export default router;
