import Router from "express";
import { menuController } from "./menu.controller";


const router = Router();

// router.post("/items", menuControllers.getItems);
router.get("/items", menuController.getAllMenuItems);
// router.get("/items/:id", menuControllers.getItems);
// router.put("/items/:id", menuControllers.getItems);
// router.delete("/items/:id", menuControllers.getItems);



export const menuRoutes = router;