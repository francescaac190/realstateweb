import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import * as awardController from './award.controller';
import { createAwardSchema, updateAwardSchema } from './award.schemas';

const router = Router();

router.use(authMiddleware);

router.get('/', awardController.listAwards);
router.get('/:id', awardController.getAward);
router.post('/', validateBody(createAwardSchema), awardController.createAward);
router.patch(
  '/:id',
  validateBody(updateAwardSchema),
  awardController.updateAward,
);
router.delete('/:id', awardController.deleteAward);

export default router;
