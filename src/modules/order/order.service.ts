import { pool } from "../../config/db";

export const createOrderItems = async (orderData: {
    user_id: string;
    items: Array<{ item_id: string; quantity: number; price: number }>;
}) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Start Transaction
        const savedItems = [];
        for (const item of orderData.items) {
            const totalPrice = item.price * item.quantity;
            const queryText = `
                INSERT INTO orders (item_id, user_id, quantity, totalprice, status)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [
                item.item_id,
                orderData.user_id,
                item.quantity,
                totalPrice,
                'active' // Initial status
            ];
            const res = await client.query(queryText, values);
            savedItems.push(res.rows[0]);
        }
        await client.query('COMMIT'); // Commit Transaction
        return savedItems;
    } catch (error) {
        await client.query('ROLLBACK'); // Cancel everything if one fails
        throw error;
    } finally {
        client.release();
    }
};