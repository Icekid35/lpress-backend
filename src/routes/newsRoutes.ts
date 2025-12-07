import { Router } from 'express';
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  uploadImages,
} from '../controllers/newsController';
import { authenticatePublic, authenticateServiceRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createNewsSchema, updateNewsSchema } from '../validators/schemas';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', authenticatePublic, getAllNews);
router.get('/:id', authenticatePublic, getNewsById);
router.post('/', authenticateServiceRole, validate(createNewsSchema), createNews);
router.put('/:id', authenticateServiceRole, validate(updateNewsSchema), updateNews);
router.delete('/:id', authenticateServiceRole, deleteNews);
router.post('/upload', authenticateServiceRole, upload.array('images', 6), uploadImages);

export default router;
