import { Router } from 'express';
import * as catalogController from './catalog.controller';

const router = Router();

router.get('/roles', catalogController.getRoles);
router.get('/currencies', catalogController.getCurrencies);
router.get('/property-types', catalogController.getPropertyTypes);
router.get('/property-statuses', catalogController.getPropertyStatuses);
router.get('/cities', catalogController.getCities);
router.get('/zones', catalogController.getZones);
router.get('/branches', catalogController.getBranches);

export default router;
