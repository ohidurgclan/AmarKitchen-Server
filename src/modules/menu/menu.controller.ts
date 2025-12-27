import { Request, Response } from "express";
import { menuServices } from "./menu.service";
const getAllMenuItems = async (req: Request, res: Response) => {
    try {
        const data = await menuServices.getAllMenu();
        res.status(200).json({
            success: true,
            data
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const menuController = {getAllMenuItems};