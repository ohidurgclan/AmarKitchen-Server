// order.controller.ts
import { Request, Response } from 'express';
import * as OrderService from './order.service';
export const placeOrder = async (req: Request, res: Response) => {
    try {
        console.log("Incoming Body:", req.body); // Check if data is arriving
        const { user_id, items } = req.body;

        const order = await OrderService.createOrderItems({ user_id, items });
        res.status(201).json({ success: true, data: order });
    } catch (error: any) {
        console.error("DATABASE ERROR:", error); // Check your VS Code terminal for this!
        res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await OrderService.getAllOrders();

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};