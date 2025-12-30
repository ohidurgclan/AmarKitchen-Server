import { pool } from "../../config/db";

const getAllKirchen = async ()=>{
    const result = await pool.query(`SELECT * FROM kitchen`);
    return result;
};

export const kitchenServices = {
    getAllKirchen
};