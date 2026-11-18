import {Router} from 'express';
import testRoutes from '@/router/routes/test.js';
import authRoutes from '@/router/routes/auth.js';
import vmRoutes from '@/router/routes/exoscale.js';
import importRoutes from '@/router/routes/import.js';
import moduleRoutes from '@/router/routes/module.js';
import classRoutes from '@/router/routes/class.js';
const router = Router();

router.use('/test', testRoutes);
router.use('/auth', authRoutes);
router.use('/exoscale', vmRoutes);
router.use('/import', importRoutes);
router.use('/module', moduleRoutes);
router.use('/class', classRoutes);


export default router;