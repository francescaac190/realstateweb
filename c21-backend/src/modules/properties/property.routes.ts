import { Router } from 'express';
import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import * as propertyController from './property.controller';
import {
  createPropertySchema,
  updatePropertySchema,
} from './property.schemas';

const router = Router();

router.get('/', optionalAuthMiddleware, propertyController.listProperties);
router.get('/:id', optionalAuthMiddleware, propertyController.getProperty);
router.post(
  '/',
  authMiddleware,
  validateBody(createPropertySchema),
  propertyController.createProperty,
);
router.patch(
  '/:id',
  authMiddleware,
  validateBody(updatePropertySchema),
  propertyController.updateProperty,
);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);

export default router;
