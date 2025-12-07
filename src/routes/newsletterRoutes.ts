import { Router } from 'express';
import { authenticateServiceRole } from '../middleware/auth';
import {
  sendNewsletter,
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getCampaigns,
} from '../controllers/newsletterController';

const router = Router();

// All routes require admin authentication
router.use(authenticateServiceRole);

// Newsletter sending
router.post('/send', sendNewsletter);

// Templates management
router.get('/templates', getTemplates);
router.get('/templates/:id', getTemplateById);
router.post('/templates', createTemplate);
router.put('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

// Campaign history
router.get('/campaigns', getCampaigns);

export default router;
