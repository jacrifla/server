const connection = require('../config/db');

const Items = {
    create: async ({product_name, category_id, brand_id, barcode = null}) => {
        try {
            const query = `
                INSERT INTO items (product_name, category_id, brand_id, barcode)
                VALUES ($1, $2, $3, $4)
                RETURNING item_id, product_name, category_id, brand_id, barcode;
            `;
            const values = [product_name, category_id, brand_id, barcode];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    itemExists: async ({item_id}) => {
        try {
            const query = `
                SELECT 1
                FROM items
                WHERE item_id = $1;
            `;
            const values = [item_id];
            const result = await connection.query(query, values);
            return result.rows.length > 0;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    update: async ({item_id, product_name, category_id, brand_id, barcode}) => {
        try {
            const exists = await Items.itemExists({item_id});
            
            if (!exists) {
                throw new Error(`Item com ID ${item_id} não encontrado.`);
            }

            let query = `
                UPDATE items
                SET
            `;
            
            const values = [];
            const setFields = [];
            
            if (product_name) {
                setFields.push(`product_name = $${setFields.length + 1}`);
                values.push(product_name);
            }
            if (category_id) {
                setFields.push(`category_id = $${setFields.length + 1}`);
                values.push(category_id);
            }
            if (brand_id) {
                setFields.push(`brand_id = $${setFields.length + 1}`);
                values.push(brand_id);
            }
            if (barcode) {
                setFields.push(`barcode = $${setFields.length + 1}`);
                values.push(barcode);
            }
            
            if (setFields.length === 0) {
                throw new Error("Nenhum campo a ser atualizado foi fornecido.");
            }
    
            query += setFields.join(', ') + `
                WHERE item_id = $${setFields.length + 1}
                RETURNING item_id, product_name, category_id, brand_id, barcode;
            `;
            
            values.push(item_id);
    
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
    
    delete: async ({item_id}) => {
        
        try {
            const exists = await Items.itemExists({item_id});
                
            if (!exists) {
                throw new Error(`Item com ID ${item_id} não encontrado.`);
            }

            const query = `
                DELETE FROM items
                WHERE item_id = $1;
            `;
            const values = [item_id];
            await connection.query(query, values);
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findAll: async () => {
        try {
            const query = `
                SELECT 
                    items.item_id, 
                    items.product_name, 
                    categories.category_name, 
                    brands.brand_name, 
                    items.barcode
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id;
            `;
            const result = await connection.query(query);
            return result.rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findById: async ({item_id}) => {
        try {
            const query = `
                SELECT 
                    items.item_id, 
                    items.product_name, 
                    categories.category_name, 
                    brands.brand_name, 
                    items.barcode
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                WHERE 
                    items.item_id = $1;
            `;
            const values = [item_id];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findItemsByName: async ({ product_name }) => {
        try {
            const query = `
                SELECT 
                    items.item_id, 
                    items.product_name, 
                    categories.category_name, 
                    brands.brand_name, 
                    items.barcode
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                WHERE 
                    LOWER(items.product_name) LIKE LOWER($1);
            `;
            const values = [`%${product_name}%`];
    
            const result = await connection.query(query, values);

            return result.rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    }, 

    findItemByBarcode: async ({barcode}) => {
        try {
            const query = `
                SELECT 
                    items.item_id, 
                    items.product_name, 
                    categories.category_name, 
                    brands.brand_name, 
                    items.barcode
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                WHERE 
                    items.barcode = $1;
            `;
            const values = [barcode];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findAllWithPagination: async (limit = 10, offset = 0) => {
        try {
            const query = `
                SELECT 
                    items.item_id, 
                    items.product_name, 
                    categories.category_name, 
                    brands.brand_name, 
                    items.barcode
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                LIMIT $1 OFFSET $2;
            `;
            const values = [limit, offset];
            const result = await connection.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error(`Error fetching items with pagination: ${error.message}`);
        }
    },
}

module.exports = Items;