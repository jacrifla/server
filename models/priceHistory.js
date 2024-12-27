const connection = require('../config/db');

const PriceHistoryModel = {
    createPriceHistory: async ({ item_id, unit_price, user_id }) => {
        try {
            const query = `
                INSERT INTO price_history (item_id, unit_price, user_id)
                VALUES ($1, $2, $3)
                RETURNING history_id, item_id, unit_price, updated_at, user_id;
            `;
            const values = [item_id, unit_price, user_id];
            const { rows } = await connection.query(query, values);
            return rows[0];
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
    
    getPriceHistory: async (item_id) => {
        try {
            const query = `
                SELECT * FROM price_history
                WHERE item_id = $1
                ORDER BY updated_at DESC;
            `;
            const { rows } = await connection.query(query, [item_id]);
            return rows;
        } catch (error) {
            throw new Error(`Error: ${error.message}`);
        }
    },
};

module.exports = PriceHistoryModel;
