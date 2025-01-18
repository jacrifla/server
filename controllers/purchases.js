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
};

module.exports = PurchaseController;

