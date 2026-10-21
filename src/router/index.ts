import {Router} from 'express';
import testRoutes from '@/router/routes/test.js';
import authRoutes from '@/router/routes/auth.js';

const router = Router();

router.use('/test', testRoutes);
router.use('/auth', authRoutes)

export default router;