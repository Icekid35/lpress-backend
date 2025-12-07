import { Router } from 'express';
import projectRoutes from './projectRoutes';
import newsRoutes from './newsRoutes';
import complaintRoutes from './complaintRoutes';
import subscriberRoutes from './subscriberRoutes';

const router = Router();

router.use('/projects', projectRoutes);
router.use('/news', newsRoutes);
router.use('/complaints', complaintRoutes);
router.use('/subscribers', subscriberRoutes);

export default router;
