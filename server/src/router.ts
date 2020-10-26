import { resolve } from 'path';
import express, { Router } from 'express';

import { ItemsController, PointsController, MainController } from './controllers';


const mainController = new MainController();
const itemsController = new ItemsController();
const pointsController = new PointsController();

const router = Router();

router.get('/', mainController.index);
router.get('/health', mainController.health);
router.get('/items', itemsController.index);
router.get('/points', pointsController.index);
router.post('/points', pointsController.create);
router.get('/points/:id', pointsController.show);
router.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));


export default router;
