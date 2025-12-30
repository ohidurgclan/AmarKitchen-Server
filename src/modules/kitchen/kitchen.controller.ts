import { Request, Response } from "express";
import { kitchenServices } from "./kitchen.service";

const getKitchens = async (req: Request, res: Response) => {
  try {
    const result = await kitchenServices.getAllKirchen();
    res.status(200).json({
      success: true,
      message: "All Kitchens Successfully Found",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    })
  }
};

export const kitchenControllers = { getKitchens };