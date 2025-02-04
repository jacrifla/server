const PurchaseModel = require('../models/purchases');

const PurchaseController = {
    createPurchase: async (req, res) => {
        const { itemId, userId, quantity, price } = req.body;
        const total = price * quantity;

        try {
            const purchase = await PurchaseModel.createPurchase(itemId, userId, quantity, price, total);
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
        const { userId, startDate, endDate } = req.query;

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
        const { userId, limit } = req.query;

        try {
            const mostPurchased = await PurchaseModel.getMostPurchasedItems(userId, limit);
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
        const { userId, startDate, endDate } = req.query;

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
        const { userId, startDate, endDate } = req.query;

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
        const { userId, startDate, endDate } = req.query;

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
        const { userId, startDate, endDate } = req.query;

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
        const { userId, startDate, endDate } = req.query;

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
        const { userId, startDate, endDate } = req.query;

        try {
            const comparisonSpent = await PurchaseModel.getComparisonSpent(userId, startDate, endDate);
            res.status(200).json({
                status: true,
                data: comparisonSpent
            });
        } catch (error) {
            res.status(500).json({ 
                status: false,
                error: error.message
            });
        }
    },

    getTopItemsByValue: async (req, res) => {
        const { userId, startDate, endDate } = req.query;

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
};

module.exports = PurchaseController;