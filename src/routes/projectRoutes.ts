import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadImages,
} from '../controllers/projectController';
import { authenticatePublic, authenticateServiceRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProjectSchema, updateProjectSchema } from '../validators/schemas';
import { upload } from '../middleware/upload';

const router = Router();

router.get('/', authenticatePublic, getAllProjects);
router.get('/:id', authenticatePublic, getProjectById);
router.post('/', authenticateServiceRole, validate(createProjectSchema), createProject);
router.put('/:id', authenticateServiceRole, validate(updateProjectSchema), updateProject);
router.delete('/:id', authenticateServiceRole, deleteProject);
router.post('/upload', authenticateServiceRole, upload.array('images', 6), uploadImages);

export default router;
