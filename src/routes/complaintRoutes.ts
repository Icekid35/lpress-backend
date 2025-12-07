import { Router } from 'express';
import {
  getAllComplaints,
  getComplaintById,
  createComplaint,
  deleteComplaint,
} from '../controllers/complaintController';
import { authenticatePublic, authenticateServiceRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createComplaintSchema } from '../validators/schemas';

const router = Router();

router.get('/', authenticateServiceRole, getAllComplaints);
router.get('/:id', authenticateServiceRole, getComplaintById);
router.post('/', authenticatePublic, validate(createComplaintSchema), createComplaint);
router.delete('/:id', authenticateServiceRole, deleteComplaint);

export default router;
