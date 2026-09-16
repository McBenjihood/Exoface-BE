import {Router} from 'express';
import testRoutes from '@/router/routes/test.js';

const router = Router();

router.use('/test', testRoutes);

export default router;