const connection = require('../config/db');

const ListItem = {
    create: async ({ list_id, item_id = null, custom_product = null, item_type, quantity, unit_price = null }) => {
        const query = `
            INSERT INTO shopping_list_items 
            (list_id, item_id, custom_product, item_type, quantity, unit_price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [list_id, item_id, custom_product, item_type, quantity, unit_price];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    update: async ({ list_item_id, quantity, unit_price, custom_product }) => {
        try {
            const checkItemTypeQuery = `
                SELECT item_type 
                FROM shopping_list_items 
                WHERE list_item_id = $1;
            `;
            const { rows } = await connection.query(checkItemTypeQuery, [list_item_id]);
            
            if (rows.length === 0) {
                throw new Error('Item não encontrado.');
            }
    
            const itemType = rows[0].item_type;
    
            if (itemType !== 'custom' && custom_product) {
                throw new Error('nome do produto só pode ser atualizado para itens do tipo nao cadastrados');
            }
    
            const updates = [];
            const values = [];
    
            if (quantity) {
                updates.push(`quantity = $${updates.length + 1}`);
                values.push(quantity);
            }
            if (unit_price) {
                updates.push(`unit_price = $${updates.length + 1}`);
                values.push(unit_price);
            }
            if (custom_product && itemType === 'custom') {
                updates.push(`custom_product = $${updates.length + 1}`);
                values.push(custom_product);
            }
    
            if (updates.length === 0) {
                throw new Error('Nenhum campo válido para atualizar.');
            }
    
            const query = `
                UPDATE shopping_list_items
                SET ${updates.join(', ')}
                WHERE list_item_id = $${updates.length + 1}
                RETURNING list_item_id, quantity, unit_price, custom_product, item_type;
            `;
            values.push(list_item_id);
    
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },    

    delete: async (list_item_id) => {
        const query = `
            DELETE FROM shopping_list_items
            WHERE list_item_id = $1
            RETURNING *;
        `;
        const result = await connection.query(query, [list_item_id]);
        return result.rows[0];
    },

    getAll: async () => {
        const query = `
            SELECT * FROM shopping_list_items;
        `;
        const result = await connection.query(query);
        return result.rows;
    },

    getById: async (list_item_id) => {
        const query = `
            SELECT * FROM shopping_list_items
            WHERE list_item_id = $1;
        `;
        const result = await connection.query(query, [list_item_id]);
        return result.rows[0];
    },

    markAsPurchased: async (list_item_id) => {
        try {
            const checkItemQuery = `
                SELECT status
                FROM shopping_list_items 
                WHERE list_item_id = $1;
            `;
            const { rows } = await connection.query(checkItemQuery, [list_item_id]);
    
            if (rows.length === 0) {
                throw new Error('Item não encontrado.');
            }
    
            if (rows[0].status === 'purchased') {
                throw new Error('O item já foi marcado como comprado.');
            }
    
            const updateQuery = `
                UPDATE shopping_list_items
                SET status = 'purchased'
                WHERE list_item_id = $1
                RETURNING list_item_id, status;
            `;
            
            const result = await connection.query(updateQuery, [list_item_id]);
    
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },    
};

module.exports = ListItem;