const connection = require('../config/db');

const PurchaseModel = {
    createPurchase: async (itemId, userId, quantity, price, total, purchaseDate, marketId) => {
        try {
            const query = `
                INSERT INTO purchases (item_id, user_id, quantity, price, total, purchase_date, market_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id as "purchaseId", purchase_date as "purchaseDate";
            `;
            const values = [itemId, userId, quantity, price, total, purchaseDate, marketId];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao registrar compra: ' + error.message);
        }
    },

    getTotalSpentByPeriod: async (userId, startDate, endDate) => {
        const query = `
            SELECT SUM(total)::float AS "totalSpent"
            FROM list_totals
            WHERE user_id = $1 AND purchase_date BETWEEN $2 AND $3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    getMostPurchasedItems: async (userId, limit = 5) => {
        const query = `
            SELECT 
                i.id as "itemId",
                i.name as "itemName", 
                SUM(p.quantity)::float AS "totalQuantity"
            FROM purchases p
            JOIN items i ON p.item_id = i.id
            WHERE p.user_id = $1
            GROUP BY i.id, i.name
            HAVING SUM(p.quantity) > 1
            ORDER BY SUM(p.quantity) DESC
            LIMIT $2;
        `;
        const values = [userId, limit];
        const result = await connection.query(query, values);
        return result.rows;
    },

    getItemsPurchasedByPeriod: async (userId, startDate, endDate) => {
        const query = `
            SELECT SUM(quantity)::float AS "totalQuantity"
            FROM purchases
            WHERE user_id = $1 AND purchase_date BETWEEN $2 AND $3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    getAvgSpendPerPurchase: async (userId, startDate, endDate) => {
        const query = `
            SELECT AVG(total)::float AS "avgSpendPerPurchase"
            FROM purchases
            WHERE user_id = $1 AND purchase_date BETWEEN $2 AND $3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    getLargestPurchase: async (userId, startDate, endDate) => {
        const query = `
            SELECT MAX(total)::float AS "largestPurchase"
            FROM purchases
            WHERE user_id = $1 AND purchase_date BETWEEN $2 AND $3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows[0].largestPurchase || 0;
    },

    getAvgDailySpend: async (userId, startDate, endDate) => {
        const query = `
            SELECT  SUM(total)::float / 
                    (SELECT ( $3::DATE - $2::DATE ) ) AS "avgDailySpend"
            FROM purchases
            WHERE user_id = $1 AND purchase_date BETWEEN $2 AND $3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows[0];
    },

    getCategoryPurchases: async (userId, startDate, endDate) => {
        const query = `
            SELECT 
                c.name AS "categoryName", 
                SUM(p.total)::float AS "totalSpent"
            FROM purchases p
            JOIN items i ON p.item_id = i.id
            JOIN categories c ON i.category_id = c.id
            WHERE p.user_id = $1 
            AND p.purchase_date BETWEEN $2 AND $3
            GROUP BY c.name
            ORDER BY "totalSpent" DESC
            LIMIT 100;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows;
    },

    getComparisonSpent: async (userId, startDate, endDate, limit, offset) => {
        const query = `
            WITH price_data AS (
                SELECT 
                    i.id AS itemId,
                    i.name AS "itemName",
                    MIN(p.price) AS "minPrice",
                    MAX(p.price) AS "maxPrice"
                FROM purchases p
                JOIN items i ON p.item_id = i.id
                WHERE p.user_id = $1
                AND p.purchase_date BETWEEN $2 AND $3
                GROUP BY i.id, i.name
                HAVING MAX(p.price) - MIN(p.price) >= 1
            )
            SELECT 
                "itemName",
                "minPrice",
                "maxPrice",
                (SELECT p2.purchase_date 
                FROM purchases p2 
                WHERE p2.item_id = pd.itemId 
                AND p2.price = "minPrice" 
                ORDER BY p2.purchase_date ASC 
                LIMIT 1) AS "minPriceDate",
                (SELECT p2.purchase_date 
                FROM purchases p2 
                WHERE p2.item_id = pd.itemId 
                AND p2.price = "maxPrice" 
                ORDER BY p2.purchase_date ASC 
                LIMIT 1) AS "maxPriceDate"
            FROM price_data pd
            ORDER BY "itemName"
            LIMIT $4 OFFSET $5;
        `;
        const values = [userId, startDate, endDate, limit, offset];
        const result = await connection.query(query, values);
        return result.rows;
    },

    getTopItemsByValue: async (userId, startDate, endDate) => {
        const query = `
            SELECT i.name as "itemName", SUM(p.total)::float AS "totalValue"
            FROM purchases p
            JOIN items i ON p.item_id = i.id
            WHERE p.user_id = $1 AND p.purchase_date BETWEEN $2 AND $3
            GROUP BY i.name
            ORDER BY SUM(p.total) DESC
            LIMIT 3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows;
    },
};

module.exports = PurchaseModel;