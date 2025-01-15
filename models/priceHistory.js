const connection = require('../config/db');

const PriceHistoryModel = {
    createPriceHistory: async ({ itemId, unitPrice, userId }) => {
        try {
            const query = `
                INSERT INTO price_history (item_id, unit_price, user_id)
                VALUES ($1, $2, $3)
                RETURNING history_id, item_id, unit_price, updated_at, user_id;
            `;
            const values = [itemId, unitPrice, userId];
            const { rows } = await connection.query(query, values);
            return {
                historyId: rows[0].history_id,
                itemId: rows[0].item_id,
                unitPrice: rows[0].unit_price,
                updatedAt: rows[0].updated_at,
                userId: rows[0].user_id,
            };
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },
    
    getPriceHistory: async (itemId) => {
        try {
            const query = `
                SELECT * FROM price_history
                WHERE item_id = $1
                ORDER BY updated_at DESC;
            `;
            const { rows } = await connection.query(query, [itemId]);
            
            if (rows.length > 0) {
                return rows.map((row) => ({
                    historyId: row.history_id,
                    itemId: row.item_id,
                    unitPrice: row.unit_price,
                    updatedAt: row.updated_at,
                    userId: row.user_id,
                }));
            }

            return [];
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    },
};

module.exports = PriceHistoryModel;
