import { Router } from 'express';
import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { upload } from '../../middlewares/upload.middleware';
import * as propertyController from './property.controller';
import { updatePropertySchema } from './property.schemas';

const router = Router();

router.get('/', optionalAuthMiddleware, propertyController.listProperties);
router.get('/:id', optionalAuthMiddleware, propertyController.getProperty);

// Accepts multipart/form-data (fields + up to 20 image files under the key "images")
router.post(
  '/',
  authMiddleware,
  upload.array('images', 20),
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
