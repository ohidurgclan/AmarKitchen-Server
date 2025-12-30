import Router from "express";
import { kitchenControllers } from "./kitchen.controller";
// import logger from "../../middleware/logger";
// import auth from "../../middleware/auth";

const router = Router();

router.get("/allkitchens", kitchenControllers.getKitchens);

export const kitchenRoutes = router;