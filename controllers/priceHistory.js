const PriceHistoryModel = require('../models/priceHistory');

exports.createPriceHistory = async (req, res) => {
    const { item_id, unit_price, user_id } = req.body;

    try {
        const newHistory = await PriceHistoryModel.createPriceHistory({ item_id, unit_price, user_id });
        res.status(201).json({
            status: true,
            message: 'Histórico de preço criado com sucesso.',
            data: newHistory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao criar histórico de preço.',
            error: error.message
        });
    }
};

exports.getPriceHistory = async (req, res) => {
    const { item_id } = req.params;

    try {
        const history = await PriceHistoryModel.getPriceHistory(item_id);
        res.status(200).json({
            status: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao buscar histórico de preços.',
            error: error.message
        });
    }
};
