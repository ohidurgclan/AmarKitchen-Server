import { pool } from "../../config/db";

const getAllMenu = async () => {
    const result = await pool.query(`SELECT * FROM menu_item`);
    return result.rows;
};
export const menuServices = {getAllMenu};