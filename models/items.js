const connection = require('../config/db');

const Items = {
    createItem: async (name, categoryId, brandId, barcode) => {
        try {
            const query = `
                INSERT INTO items (name, category_id, brand_id, barcode)
                VALUES ($1, $2, $3, $4)
                RETURNING 
                    id as "itemId", 
                    name as "itemName", 
                    category_id as "categoryId", 
                    brand_id as "brandId", 
                    barcode,
                    created_at as "createdAt";
            `;
            const values = [name, categoryId, brandId, barcode];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao adicionar item: ' + error.message);
        }
    },

    itemExists: async (itemId) => {
        try {
            const query = `
                SELECT 1
                FROM items
                WHERE item_id = $1;
            `;
            const values = [itemId];
            const result = await connection.query(query, values);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    updateItem: async (itemId, name, categoryId, brandId, barcode) => {
        try {
            const query = `
                UPDATE items
                SET name = COALESCE($2, name),
                    category_id = COALESCE($3, category_id),
                    brand_id = COALESCE($4, brand_id),
                    barcode = COALESCE($5, barcode),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING id as "itemId", 
                    name as "itemName", 
                    category_id as "categoryId", 
                    brand_id as "brandId", 
                    barcode,
                    updated_at as "updatedAt";
            `;
            const values = [itemId, name, categoryId, brandId, barcode];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao atualizar item: ' + error.message);
        }
    },

    deleteItem: async (itemId) => {
        try {
            const query = `
                DELETE FROM items
                WHERE id = $1
                RETURNING id as "itemId";
            `;
            const values = [itemId];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao deletar item: ' + error.message);
        }
    },

    getItemById: async (id) => {
        const query = `
            SELECT
                i.id as "itemId",
                i.name as "itemName",
                i.barcode::BIGINT as barcode,
                c.name as "categoryName",
                i.category_id as "categoryId",
                b.name as "brandName",
                i.brand_id as "brandId"
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN brands b ON i.brand_id = b.id
            WHERE i.id = $1;
        `;
        const values = [id];
        const result = await connection.query(query, values);
        return result.rows;
    },
    
    getItemByName: async (name) => {
        const query = `
            SELECT
                i.id as "itemId",
                i.name as "itemName",
                i.barcode::BIGINT as barcode,
                c.name as "categoryName",
                i.category_id as "categoryId",
                b.name as "brandName",
                i.brand_id as "brandId"
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN brands b ON i.brand_id = b.id
            WHERE i.name ILIKE $1;
        `;
        const values = [`%${name}%`];
        const result = await connection.query(query, values);
        return result.rows;
    },
    
    getItemByBarcode: async (barcode) => {        
        const query = `
            SELECT
            i.id as "itemId",
            i.name as "itemName",
            i.barcode::BIGINT as barcode,
            c.name as "categoryName",
            i.category_id as "categoryId",
            b.name as "brandName",
            i.brand_id as "brandId"
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN brands b ON i.brand_id = b.id
            WHERE i.barcode = $1;
        `;
        const values = [barcode];
        const result = await connection.query(query, values);
        
        return result.rows;
    },        

    getAllItems: async () => {
        const query = `
            SELECT 
                i.id as "itemId",
                i.name as "itemName",
                i.barcode,
                c.name as "categoryName",
                i.category_id as "categoryId",
                b.name as "brandName",
                i.brand_id as "brandId"
            FROM items i
            LEFT JOIN categories c ON i.category_id = c.id
            LEFT JOIN brands b ON i.brand_id = b.id;
        `;
        const result = await connection.query(query);
        return result.rows;
    },

}

module.exports = Items;
