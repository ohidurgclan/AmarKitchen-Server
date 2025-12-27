import { Pool } from "pg";
import config from ".";

// DB
export const pool = new Pool({
    connectionString: `${config.connection_str}`,
});

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_name VARCHAR(50) NOT NULL,
            p_img TEXT,
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(200) NOT NULL,
            role VARCHAR(20) NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    /* ========================
       KITCHEN
    ======================== */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS kitchen (
            kitchen_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
            name VARCHAR(50) NOT NULL,
            user_name VARCHAR(50) UNIQUE NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(100),
            social_media JSONB,
            cuisine_type VARCHAR(50),
            opening_hours JSONB,
            open_status BOOLEAN DEFAULT true,
            active_status BOOLEAN DEFAULT true,
            pre_order BOOLEAN DEFAULT false,
            ratings FLOAT CHECK (ratings BETWEEN 1 AND 5),
            delivery_available BOOLEAN DEFAULT false,
            delivery_radius_km INT,
            payment_methods TEXT[],
            delivery_partners TEXT[],
            average_preparation INT,
            kitchen_manager JSONB,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    /* ========================
       RAIDERS
    ======================== */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS raiders (
            raider_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
            raider_name VARCHAR(50),
            p_img TEXT,
            phone VARCHAR(20),
            email VARCHAR(20),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    /* ========================
       LOCATION (SHARED)
    ======================== */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS location (
            location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            kitchen_id UUID REFERENCES kitchen(kitchen_id) ON DELETE CASCADE,
            user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
            raider_id UUID REFERENCES raiders(raider_id) ON DELETE CASCADE,
            nid VARCHAR(30),
            status VARCHAR(30) NOT NULL
                CHECK (status IN ('primary','secondary','inactive')),
            address VARCHAR(50),
            nearby VARCHAR(50),
            area VARCHAR(50),
            thana VARCHAR(50),
            postal CHAR(4),
            city VARCHAR(50),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    /* ========================
       MENU ITEM
    ======================== */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS menu (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            kitchen_id UUID REFERENCES kitchen(kitchen_id) ON DELETE CASCADE,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(50),
            description TEXT,
            img TEXT,
            label VARCHAR(50),
            price NUMERIC(10,2) NOT NULL,
            discount INT,
            extra TEXT,
            quantity INT,
            inventory INT,
            preparation_time INT,
            rating FLOAT CHECK (rating BETWEEN 1 AND 5),
            sale_status VARCHAR(30),
            veg BOOLEAN DEFAULT false,
            tags JSONB,
            daily_order INT DEFAULT 0,
            weekly_order INT DEFAULT 0,
            total_order INT DEFAULT 0,
            pre_order BOOLEAN DEFAULT false,
            available BOOLEAN DEFAULT true,
            tax INT DEFAULT 0,
            warning TEXT,
            types VARCHAR(50),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `);
    /* ========================
       ORDERS
    ======================== */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
            order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            item_id UUID REFERENCES menu_item(item_id),
            user_id UUID REFERENCES users(user_id),
            raider_id UUID REFERENCES raiders(raider_id),
            quantity INT NOT NULL,
            totalprice NUMERIC(10,2) NOT NULL,
            status VARCHAR(20)
                CHECK (status IN ('active','completed','cancelled')),
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
    /* ========================
       MENU ITEM REVIEW
    ======================== */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS menu_review (
            review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            item_id UUID REFERENCES menu_item(item_id) ON DELETE CASCADE,
            user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
            user_name VARCHAR(30),
            rating FLOAT CHECK (rating BETWEEN 1 AND 5),
            review TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
    /* ========================
       KITCHEN REVIEW
    ======================== */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS kitchen_review (
            review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
            kitchen_id UUID REFERENCES kitchen(kitchen_id) ON DELETE CASCADE,
            user_name VARCHAR(30),
            rating FLOAT CHECK (rating BETWEEN 1 AND 5),
            review TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
    /* ========================
       RAIDER REVIEW
    ======================== */
    await pool.query(`
        CREATE TABLE IF NOT EXISTS raider_review (
            review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
            raider_id UUID REFERENCES raiders(raider_id) ON DELETE CASCADE,
            user_name VARCHAR(30),
            rating FLOAT CHECK (rating BETWEEN 1 AND 5),
            review TEXT,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `);
    console.log("Connected")
};
export default initDB;