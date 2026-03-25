import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import * as contactController from './contact.controller';
import {
  createContactSchema,
  updateContactSchema,
} from './contact.schemas';

const router = Router();

router.use(authMiddleware);

router.get('/', contactController.listContacts);
router.get('/:id', contactController.getContact);
router.post('/', validateBody(createContactSchema), contactController.createContact);
router.patch(
  '/:id',
  validateBody(updateContactSchema),
  contactController.updateContact,
);
router.delete('/:id', contactController.deleteContact);

export default router;
