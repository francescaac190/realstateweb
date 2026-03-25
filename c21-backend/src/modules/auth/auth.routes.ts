import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import * as authController from './auth.controller';
import {
  changePasswordSchema,
  loginSchema,
  logoutSchema,
  refreshSchema,
  registerSchema,
} from './auth.schemas';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/refresh', validateBody(refreshSchema), authController.refresh);
router.post(
  '/logout',
  authMiddleware,
  validateBody(logoutSchema),
  authController.logout,
);
router.post(
  '/change-password',
  authMiddleware,
  validateBody(changePasswordSchema),
  authController.changePassword,
);

export default router;
