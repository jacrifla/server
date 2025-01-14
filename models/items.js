const connection = require('../config/db');
const ItemNotesModel = require('./itemNotes');

const Items = {
    create: async ({ productName, categoryId, brandId, barcode = null, note = null, userId = null }) => {
        try {
            const query = `
                INSERT INTO items (product_name, category_id, brand_id, barcode)
                VALUES ($1, $2, $3, $4)
                RETURNING item_id, product_name, category_id, brand_id, barcode;
            `;
            const values = [productName, categoryId, brandId, barcode];
            const result = await connection.query(query, values);
            const newItem = {
                itemId: result.rows[0].item_id,
                productName: result.rows[0].product_name,
                categoryId: result.rows[0].category_id,
                brandId: result.rows[0].brand_id,
                barcode: result.rows[0].barcode,
                observation: null
            }

            if (note) {
                await ItemNotesModel.createNote({ userId, itemId: newItem.item_id, note });
            }

            return newItem;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    itemExists: async ({ itemId }) => {
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

    update: async ({ itemId, productName, categoryId, brandId, barcode, note = null, userId = null }) => {        
        try {
            const exists = await Items.itemExists({ itemId });

            if (!exists) {
                throw new Error(`Item com ID ${itemId} não encontrado.`);
            }

            let query = `
                UPDATE items
                SET
            `;

            const values = [];
            const setFields = [];

            if (productName) {
                setFields.push(`product_name = $${setFields.length + 1}`);
                values.push(productName);
            }
            if (categoryId) {
                setFields.push(`category_id = $${setFields.length + 1}`);
                values.push(categoryId);
            }
            if (brandId) {
                setFields.push(`brand_id = $${setFields.length + 1}`);
                values.push(brandId);
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

            values.push(itemId);

            const result = await connection.query(query, values);
            
            const updatedItem = result.rows[0];
            console.log(updatedItem);
            

            const formattedItem = {
                itemId: updatedItem.item_id,
                productName: updatedItem.product_name,
                categoryId: updatedItem.category_id,
                brandId: updatedItem.brand_id,
                barcode: updatedItem.barcode
            };

            if (note) {
                await ItemNotesModel.updateNote({ note, userId, itemId });
                formattedItem.note = note;
                formattedItem.userId = userId;
            }            

            return formattedItem;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    delete: async ({ itemId }) => {

        try {
            const exists = await Items.itemExists({ itemId });

            if (!exists) {
                throw new Error(`Item com ID ${itemId} não encontrado.`);
            }

            const query = `
                DELETE FROM items
                WHERE item_id = $1;
            `;
            const values = [itemId];
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
                    items.category_id,
                    categories.category_name,
                    items.brand_id,
                    brands.brand_name, 
                    items.barcode,
                    item_notes.note_id,
                    item_notes.user_id,
                    item_notes.note AS observation
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                LEFT JOIN
                    item_notes ON items.item_id = item_notes.item_id;
            `;
            const result = await connection.query(query);

            // Formatação dos itens
            const formattedItems = result.rows.map(item => ({
                itemId: item.item_id,
                item: item.product_name,
                categoryId: item.category_id,
                categoryName: item.category_name,
                brandId: item.brand_id,
                brandName: item.brand_name,
                barcode: item.barcode,
                observation: item.observation || null
            }));            

            return formattedItems;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },

    findById: async ({ itemId }) => {
        try {
            const query = `
                SELECT 
                    items.item_id, 
                    items.product_name, 
                    categories.category_name, 
                    brands.brand_name, 
                    items.barcode,
                    item_notes.note AS observation  -- Incluindo observação na busca por ID
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                LEFT JOIN
                    item_notes ON items.item_id = item_notes.item_id
                WHERE 
                    items.item_id = $1;
            `;
            const values = [itemId];
            const result = await connection.query(query, values);
    
            const item = result.rows[0];
            return {
                itemId: item.item_id,
                item: item.product_name,
                categoryName: item.category_name,
                brandName: item.brand_name,
                barcode: item.barcode,
                observation: item.observation || null
            };
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
    

    findItemsByName: async ({ productName }) => {
        try {
            const query = `
                SELECT 
                    items.item_id, 
                    items.product_name, 
                    categories.category_name, 
                    brands.brand_name, 
                    items.barcode,
                    item_notes.note AS observation  -- Incluindo observação na busca por nome
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                LEFT JOIN
                    item_notes ON items.item_id = item_notes.item_id
                WHERE 
                    LOWER(items.product_name) LIKE LOWER($1);
            `;
            const values = [`%${productName}%`];
    
            const result = await connection.query(query, values);
    
            return result.rows.map(item => ({
                itemId: item.item_id,
                item: item.product_name,
                categoryName: item.category_name,
                brandName: item.brand_name,
                barcode: item.barcode,
                observation: item.observation || null
            }));
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
    

    findItemByBarcode: async ({ barcode }) => {
        try {
            const query = `
                SELECT 
                    items.item_id, 
                    items.product_name, 
                    categories.category_name, 
                    brands.brand_name, 
                    items.barcode,
                    item_notes.note AS observation  -- Incluindo observação na busca por código de barras
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                LEFT JOIN
                    item_notes ON items.item_id = item_notes.item_id
                WHERE 
                    items.barcode = $1;
            `;
            const values = [barcode];
            const result = await connection.query(query, values);
    
            return result.rows.map(item => ({
                itemId: item.item_id,
                item: item.product_name,
                categoryName: item.category_name,
                brandName: item.brand_name,
                barcode: item.barcode,
                observation: item.observation || null
            }));
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
                    items.barcode,
                    item_notes.note AS observation  -- Incluindo observação com paginação
                FROM 
                    items
                LEFT JOIN 
                    categories ON items.category_id = categories.category_id
                LEFT JOIN 
                    brands ON items.brand_id = brands.brand_id
                LEFT JOIN
                    item_notes ON items.item_id = item_notes.item_id
                LIMIT $1 OFFSET $2;
            `;
            const values = [limit, offset];
            const result = await connection.query(query, values);
    
            return result.rows.map(item => ({
                itemId: item.item_id,
                item: item.product_name,
                categoryName: item.category_name,
                brandName: item.brand_name,
                barcode: item.barcode,
                observation: item.observation || null
            }));
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
    
}

module.exports = Items;
