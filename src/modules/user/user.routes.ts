import Router from "express";
import { userControllers } from "./user.controller";
// import logger from "../../middleware/logger";
// import auth from "../../middleware/auth";

const router = Router();

router.post("/users", userControllers.createUser);
router.get("/users", userControllers.getUser);
router.get("/users", userControllers.getUser);
router.get("/users/customer", userControllers.getUserAsCustomer);




export const userRouts = router;