const connection = require('../config/db');

const ListItem = {
    create: async ({ listId, itemId = null, customProduct = null, itemType, quantity, unitPrice = null }) => {
        try {
            const query = `
                INSERT INTO shopping_list_items 
                (list_id, item_id, custom_product, item_type, quantity, unit_price)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *;
            `;
            const values = [listId, itemId, customProduct, itemType, quantity, unitPrice];
            const result = await connection.query(query, values);

            return {
                itemListId: result.rows[0].list_item_id,
                listId: result.rows[0].list_id,
                itemId: result.rows[0].item_id,
                customProduct: result.rows[0].custom_product,
                itemType: result.rows[0].item_type,
                quantity: parseFloat(result.rows[0].quantity),
                unitPrice: parseFloat(result.rows[0].unit_price),
            };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    update: async ({ itemListId, quantity, unitPrice, customProduct }) => {
        try {
            const checkItemTypeQuery = `
                SELECT item_type 
                FROM shopping_list_items 
                WHERE list_item_id = $1;
            `;
            const { rows } = await connection.query(checkItemTypeQuery, [itemListId]);

            let itemType;
            let customName = customProduct;

            if (rows.length === 0) {
                itemType = 'custom';
            } else {
                itemType = rows[0].item_type;
                if (itemType === 'common' && customProduct) {
                    throw new Error('Não é permitido alterar o nome para itens do tipo "common".');
                }
                if (itemType === 'custom' && customProduct) {
                    customName = customProduct;
                }
            }
            const updates = [];
            const values = [];

            if (quantity) {
                updates.push(`quantity = $${updates.length + 1}`);
                values.push(quantity);
            }
            if (unitPrice) {
                updates.push(`unit_price = $${updates.length + 1}`);
                values.push(unitPrice);
            }
            if (customProduct && itemType === 'custom') {
                updates.push(`custom_product = $${updates.length + 1}`);
                values.push(customProduct);
            }

            if (updates.length === 0) {
                throw new Error('Nenhum campo válido para atualizar.');
            }

            const query = `
                UPDATE shopping_list_items
                SET ${updates.join(', ')}
                WHERE list_item_id = $${updates.length + 1}
                RETURNING *;
            `;
            values.push(itemListId);

            const result = await connection.query(query, values);

            return {
                itemListId: result.rows[0].list_item_id,
                listId: result.rows[0].list_id,
                itemId: result.rows[0].item_id || null,
                quantity: parseFloat(result.rows[0].quantity),
                unitPrice: parseFloat(result.rows[0].unit_price),
                customProduct: result.rows[0].custom_product || null,
                itemType: result.rows[0].item_type,
                status: result.rows[0].status
            };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    delete: async (itemListId) => {
        try {
            const query = `
                DELETE FROM shopping_list_items
                WHERE list_item_id = $1
                RETURNING list_item_id;
            `;
            const result = await connection.query(query, [itemListId]);
    
            if (result.rows.length === 0) {
                throw new Error('Item não encontrado.');
            }
    
            return {
                status: 'success',
                message: 'Deletado com sucesso.',
            };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },    

    getAll: async () => {
        try {
            const query = `
                SELECT 
                    sli.list_id,
                    sli.list_item_id,
                    sli.item_id,
                    sli.custom_product,
                    sli.item_type,
                    sli.quantity,
                    sli.unit_price,
                    sli.status,
                    i.product_name
                FROM shopping_list_items sli
                LEFT JOIN items i ON sli.item_id = i.item_id;
            `;
            const result = await connection.query(query);

            return result.rows.map((row) => ({
                itemListId: row.list_item_id,
                listId: row.list_id,
                itemId: row.item_id || null,
                customProduct: row.custom_product || null,
                itemType: row.item_type,
                quantity: parseFloat(row.quantity),
                unitPrice: parseFloat(row.unit_price),
                status: row.status,
                productName: row.product_name || null
            }));
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },

    getByListId: async (listId) => {
        try {
            const query = `
                SELECT
                    sli.list_item_id,
                    sli.item_type,
                    sli.quantity,
                    sli.unit_price,
                    sli.custom_product,
                    i.item_id AS itemId,
                    i.product_name AS itemName
                FROM shopping_list_items sli
                LEFT JOIN items i ON sli.item_type = 'common' AND sli.item_id = i.item_id
                WHERE sli.list_id = $1;
            `;
            const values = [listId];
            const result = await connection.query(query, values);
            console.log(result.rows);
            
    
            return result.rows
                .map((row) => {
                    const quantity = parseFloat(row.quantity) || null;
                    const price = parseFloat(row.unit_price) || null;
    
                    return {
                        itemListId: row.list_item_id,
                        itemName: row.item_type === 'common' ? row.itemname || null : null,
                        type: row.item_type || null,
                        quantity: quantity,
                        price: price,
                        customName: row.item_type === 'custom' ? row.custom_product || null : null,
                    };
                })
                .filter(item => item !== null);
    
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },
    

    markAsPurchased: async (itemListId) => {
        try {
            const checkItemQuery = `
                SELECT status
                FROM shopping_list_items 
                WHERE list_item_id = $1;
            `;
            const { rows } = await connection.query(checkItemQuery, [itemListId]);

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
                RETURNING *;
            `;

            const result = await connection.query(updateQuery, [itemListId]);

            return {
                itemListId: result.rows[0].list_item_id,
                status: result.rows[0].status,
            };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
};

module.exports = ListItem;