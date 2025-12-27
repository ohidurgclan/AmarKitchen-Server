import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import config from "../../config";

const createUserService = async (payload: any) => {
    const {
        name,
        p_img,
        email,
        password,
        role,
        location
    } = payload;
    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.slt_round)
    );
    const userResult = await pool.query(
        `
    INSERT INTO users (user_name, p_img, email, password, role)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING user_id, user_name, email, role
    `,
        [name, p_img, email, hashedPassword, role]
    );

    const userId = userResult.rows[0].user_id;
    await pool.query(
        `
    INSERT INTO location (
      user_id,
      status,
      address,
      nearby,
      area,
      thana,
      postal,
      city
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
        [
            userId,
            location.status || 'primary',
            location.address,
            location.nearby,
            location.area,
            location.thana,
            location.postal,
            location.city
        ]
    );
    return userResult.rows[0];
};

const getUsersWithLocation = async () => {
    const result = await pool.query(`
    SELECT
      u.user_id,
      u.user_name,
      u.email,
      u.role,
      l.address,
      l.nearby,
      l.area,
      l.thana,
      l.city,
      l.status
    FROM users u
    LEFT JOIN location l
      ON u.user_id = l.user_id
  `);

    return result.rows;
};

const getUser = async ()=>{
    console.log("working")
    const result = await pool.query(`SELECT * FROM users`);
    return result;
};

const getSingleUser = async(id:string) =>{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return result;
};
const updateSingleUser = async (name:string, email:string, id:string) =>{
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,[name, email, id]);
    return result;
};

const delSingleUser = async(id: string) => {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    return result
}

export const userServices = {
    createUserService, getUser, getSingleUser, updateSingleUser, delSingleUser, getUsersWithLocation
};
