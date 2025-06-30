const PurchaseModel = require('../models/purchases');

const PurchaseController = {
    createPurchase: async (req, res) => {
        const userId = req.user.userId;
        const { itemId, quantity, price, purchaseDate, marketId } = req.body;
        const total = price * quantity;

        // Usar a data fornecida ou pegar a data atual
        const dateToUse = purchaseDate || new Date().toISOString().split('T')[0];
        try {
            const purchase = await PurchaseModel.createPurchase(
                itemId,
                userId,
                quantity,
                price,
                total,
                dateToUse,
                marketId
            );

            res.status(201).json({
                status: true,
                message: 'Compra registrada com sucesso',
                data: purchase
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getTotalSpent: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        if (!userId || !startDate || !endDate) {
            return res.status(400).json({
                status: false,
                error: 'Parâmetros inválidos. Certifique-se de fornecer userId, startDate e endDate.'
            });
        }

        try {
            const totalSpent = await PurchaseModel.getTotalSpentByPeriod(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: totalSpent
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getMostPurchased: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate, limit } = req.query;

        const rawLimit = parseInt(limit);
        const safeLimit = isNaN(rawLimit) || rawLimit <= 0 ? 5 : rawLimit;

        try {
            const mostPurchased = await PurchaseModel.getMostPurchasedItems(userId, startDate, endDate, safeLimit);
            res.status(200).json({
                status: true,
                data: mostPurchased
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getItemsPurchased: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        try {
            const totalQuantity = await PurchaseModel.getItemsPurchasedByPeriod(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: totalQuantity
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getAvgSpendPerPurchase: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        try {
            const avgSpend = await PurchaseModel.getAvgSpendPerPurchase(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: avgSpend
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getLargestPurchase: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        try {
            const largestPurchase = await PurchaseModel.getLargestPurchase(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: largestPurchase
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getAvgDailySpend: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        try {
            const avgDailySpend = await PurchaseModel.getAvgDailySpend(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: avgDailySpend
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getCategoryPurchases: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        try {
            const categoryPurchases = await PurchaseModel.getCategoryPurchases(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: categoryPurchases
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getComparisonSpent: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { startDate, endDate, page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const comparisonSpent = await PurchaseModel.getComparisonSpent(userId, startDate, endDate, Number(limit), Number(offset));
            const totalCount = await PurchaseModel.getComparisonSpentCount(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: [comparisonSpent, totalCount]

            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getTopItemsByValue: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        try {
            const topItems = await PurchaseModel.getTopItemsByValue(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: topItems
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getItemPriceVariation: async (req, res) => {
        const userId = req.user.userId;
        const { startDate, endDate } = req.query;

        try {
            const variation = await PurchaseModel.getItemPriceVariation(userId, startDate, endDate);

            res.status(200).json({
                status: true,
                data: variation
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },
};

module.exports = PurchaseController;