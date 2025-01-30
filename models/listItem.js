const connection = require('../config/db');

const ListItem = {
    create: async (itemData) => {
        try {
            let itemName = itemData.itemName;

            if (itemData.itemId) {
                const queryItemName = `
                    SELECT name 
                    FROM items 
                    WHERE id = $1;
                `;
                const result = await connection.query(queryItemName, [itemData.itemId]);
                if (result.rowCount === 0) {
                    throw new Error('Item não encontrado no banco de dados');
                }
                itemName = result.rows[0].name;
            }

            const insertQuery = `
                INSERT INTO list_items (list_id, item_id, item_name, item_type, quantity, price)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING 
                    id AS "itemListId",
                    list_id AS "listId",
                    item_id AS "itemId",
                    item_name AS "itemName",
                    item_type AS "itemType",
                    quantity::float AS "quantity",
                    price::float AS "price",
                    created_at AS "createdAt";
            `;

            const values = [
                itemData.listId,
                itemData.itemId || null,
                itemName,
                itemData.itemId ? 'common' : 'custom',
                itemData.quantity,
                itemData.price,
            ];

            const listItemResult = await connection.query(insertQuery, values);

            return listItemResult.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },

    findByListId: async (listId) => {
        try {
            const query = `
                SELECT 
                    li.id as "itemListId", 
                    li.list_id as "listId", 
                    li.item_id as "itemId", 
                    li.item_name as "itemName", 
                    li.item_type as "itemType", 
                    li.quantity::float as "quantity", 
                    li.price::float as "price", 
                    li.created_at as "createdAt",
                    li.purchased_at as "purchasedAt"
                FROM list_items li
                WHERE li.list_id = $1;
            `;
            const result = await connection.query(query, [listId]);
            return result.rows;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    update: async (itemListId, itemData) => {
        try {
            let updateQuery = `
                UPDATE list_items 
                SET 
                    quantity = $2, 
                    price = $3
                    ${itemData.itemName ? ", item_name = $4" : ""}
                WHERE id = $1
                RETURNING id as "itemListId", 
                    list_id AS "listId", 
                    item_id AS "itemId", 
                    item_name AS "itemName", 
                    item_type AS "itemType", 
                    quantity::float, price::float, 
                    created_at AS "createdAt";
            `;

            const values = [itemListId, itemData.quantity, itemData.price];

            if (itemData.itemName) {
                values.push(itemData.itemName);
            }

            const updateResult = await connection.query(updateQuery, values);
            return updateResult.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },

    delete: async (itemListId) => {
        try {
            const deleteQuery = `
                DELETE FROM list_items
                WHERE id = $1
                RETURNING id AS "itemListId", list_id AS "listId";
            `;
            const result = await connection.query(deleteQuery, [itemListId]);
            if (result.rowCount === 0) {
                throw new Error('Item não encontrado');
            }
            return result.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },

    verifyType: async (itemId) => {
        const query = `
            SELECT item_type AS "itemType"
            FROM list_items
            WHERE item_id = $1;
        `;

        const values = [itemId];
        const result = await connection.query(query, values);
        return result.rows[0].itemType;
    },

    getItemDetails: async (itemListId) => {
        const query = `
            SELECT 
                li.id AS "itemListId",
                li.item_name AS "itemName",
                li.quantity,
                li.price,
                li.item_type AS "itemType",
                li.list_id AS "listId"
            FROM list_items li
            WHERE li.id = $1;
        `;
        const values = [itemListId];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    markAsPurchase: async (itemListId) => {
        try {
            const updateQuery = `
                UPDATE list_items
                SET purchased_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING id AS "itemListId", list_id AS "listId";
            `;
            const result = await connection.query(updateQuery, [itemListId]);
            if (result.rowCount === 0) {
                throw new Error('Item não encontrado');
            }
            return result.rows[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },
};

module.exports = ListItem;