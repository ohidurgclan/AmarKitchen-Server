import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUser = async(email: string, password: string) =>{
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    if(result.rows.length === 0){
        return null
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return false;
    }
    const token = jwt.sign({ id: user.user_id, name: user.user_name, email: user.email, role: user.role },config.jwtSecret as string, {expiresIn:"7d"},);
    return {token, user};
};

const signupUser = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, address } = payload;
  const hashedPassword = await bcrypt.hash(password as string, Number(config.slt_round));
  const result = await pool.query(
    `INSERT INTO users (name, email, password, phone)
     VALUES ($1, LOWER($2), $3, $4, $5)
     RETURNING *`,
    [name, email, hashedPassword, phone, address]
  );
  return result;
};

export const authServices = {
    loginUser, signupUser
};