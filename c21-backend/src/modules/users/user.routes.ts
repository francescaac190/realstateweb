import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import * as userController from './user.controller';
import { createUserSchema, updateUserSchema } from './user.schemas';

const router = Router();

// Public — no auth required
router.get('/:id/properties', optionalAuthMiddleware, userController.getAgentProperties);

router.use(authMiddleware);

router.get('/', userController.listUsers);
router.get('/me', userController.getProfile);
router.patch('/me', validateBody(updateUserSchema), userController.updateProfile);

router.get('/:id', userController.getUser);
router.post('/', validateBody(createUserSchema), userController.createUser);
router.patch('/:id', validateBody(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
