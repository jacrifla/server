const MarketModel = require('../models/markets');

const MarketController = {
    createMarket: async (req, res) => {
        try {
            const { marketName } = req.body;

            if (!marketName || marketName.trim() === '') {
                return res.status(400).json({
                    status: false,
                    error: 'Nome do mercado é obrigatório.'
                });
            }

            const market = await MarketModel.create(marketName);
            return res.status(201).json({
                status: true,
                data: market,
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    getAllMarkets: async (req, res) => {
        try {
            const markets = await MarketModel.findAll();
            return res.status(200).json({
                status: true,
                data: markets,
            });

        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    updateMarket: async (req, res) => {
        try {
            const { marketId } = req.params;
            const { marketName } = req.body;

            if (!marketName || marketName.trim() === '') {
                return res.status(400).json({
                    status: false,
                    error: 'Nome do mercado é obrigatório para atualização.'
                });
            }

            const updated = await MarketModel.update(marketId, marketName);
            return res.status(200).json({
                status: true,
                data: updated
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },

    deleteMarket: async (req, res) => {
        try {
            const { marketId } = req.params;

            const deleted = await MarketModel.delete(marketId);

            return res.status(200).json({
                status: true,
                data: deleted,
                message: 'Mercado deletado com sucesso.',
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message
            });
        }
    },
}

module.exports = MarketController;