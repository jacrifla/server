const connection = require('../config/db');

const PurchaseModel = {
    createPurchase: async (itemId, userId, quantity, price, total) => {
        try {
            const query = `
                INSERT INTO purchases (item_id, user_id, quantity, price, total)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id as "purchaseId", purchase_date as "purchaseDate";
            `;
            const values = [itemId, userId, quantity, price, total];
            const result = await connection.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error('Erro ao registrar compra: ' + error.message);
        }
    },

    getTotalSpentByPeriod: async (userId, startDate, endDate) => {
        const query = `
            SELECT SUM(total)::float AS "totalSpent"
            FROM purchases
            WHERE user_id = $1 AND purchase_date BETWEEN $2 AND $3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows[0].totalSpent || 0;
    },

    getMostPurchasedItems: async (userId, limit = 5) => {
        const query = `
            SELECT i.name as "itemName", SUM(p.quantity)::float AS "totalQuantity"
            FROM purchases p
            JOIN items i ON p.item_id = i.id
            WHERE p.user_id = $1
            GROUP BY i.name
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
        return result.rows[0].totalQuantity || 0;
    },

    getAvgSpendPerPurchase: async (userId, startDate, endDate) => {
        const query = `
            SELECT AVG(total)::float AS "avgSpendPerPurchase"
            FROM purchases
            WHERE user_id = $1 AND purchase_date BETWEEN $2 AND $3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows[0].avgSpendPerPurchase || 0;
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
        return result.rows[0].avgDailySpend || 0;
    },

    getCategoryPurchases: async (userId, startDate, endDate) => {
        const query = `
            SELECT 
                c.name AS categoryName, 
                SUM(p.total)::float AS totalSpent
            FROM purchases p
            JOIN items i ON p.item_id = i.id
            JOIN categories c ON i.category_id = c.id
            WHERE p.user_id = $1 
            AND p.purchase_date BETWEEN $2 AND $3
            GROUP BY c.name
            ORDER BY totalSpent DESC
            LIMIT 100;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows;
    },

    getComparisonSpent: async (userId, startDate, endDate) => {
        const query = `
            SELECT SUM(total)::float AS "totalSpent"
            FROM purchases
            WHERE user_id = $1 AND purchase_date BETWEEN $2 AND $3;
        `;
        const values = [userId, startDate, endDate];
        const result = await connection.query(query, values);
        return result.rows[0].totalSpent || 0;
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