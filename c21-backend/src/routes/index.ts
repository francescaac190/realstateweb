import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import propertyRoutes from '../modules/properties/property.routes';
import contactRoutes from '../modules/contacts/contact.routes';
import awardRoutes from '../modules/awards/award.routes';
import catalogRoutes from '../modules/catalog/catalog.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/contacts', contactRoutes);
router.use('/awards', awardRoutes);
router.use('/catalog', catalogRoutes);

export default router;
