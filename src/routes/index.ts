import { Router } from 'express';
import projectRoutes from './projectRoutes';
import newsRoutes from './newsRoutes';
import complaintRoutes from './complaintRoutes';
import subscriberRoutes from './subscriberRoutes';
import newsletterRoutes from './newsletterRoutes';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/news', newsRoutes);
router.use('/complaints', complaintRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/newsletter', newsletterRoutes);

export default router;
