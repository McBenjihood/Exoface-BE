import {Router} from 'express';
import testRoutes from '@/router/routes/test.js';
import authRoutes from '@/router/routes/auth.js';
import vmRoutes from '@/router/routes/vms.js';
import importRoutes from '@/router/routes/import.js';

const router = Router();

router.use('/test', testRoutes);
router.use('/auth', authRoutes);
router.use('/vms', vmRoutes);
router.use('/import', importRoutes);

export default router;