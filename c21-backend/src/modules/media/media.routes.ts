import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { upload } from '../../middlewares/upload.middleware';
import { uploadMedia } from './media.controller';

const router = Router();

router.post('/', authMiddleware, upload.array('files', 20), uploadMedia);

export default router;
