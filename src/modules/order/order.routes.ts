import { Router } from 'express';
import * as OrderController from './order.controller';

const router = Router();

router.post("/place", OrderController.placeOrder);

export const orderRoutes = router;