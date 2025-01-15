const PriceHistoryModel = require('../models/priceHistory');

exports.createPriceHistory = async (req, res) => {
    const { itemId, unitPrice, userId } = req.body;

    try {
        const newHistory = await PriceHistoryModel.createPriceHistory({ itemId, unitPrice, userId });
        res.status(201).json({
            status: true,
            message: 'Histórico de preço criado com sucesso.',
            data: newHistory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.getPriceHistory = async (req, res) => {
    const { itemId } = req.params;

    try {
        const history = await PriceHistoryModel.getPriceHistory(itemId);
        res.status(200).json({
            status: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
