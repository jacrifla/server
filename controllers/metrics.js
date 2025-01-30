const MetricsModel = require('../models/metrics');

exports.getTotalSpentByPeriod = async (req, res) => {
    const { startDate, endDate } = req.query;
    const userId = req.user?.userId;

    if (!startDate ||!endDate) {
        return res.status(400).json({
            status: false,
            message: 'Os períodos de início e fim são necessários'
        });
    }

    try {
        const totalSpent = await MetricsModel.getTotalSpentByPeriod({startDate, endDate, userId});
        res.status(200).json({
            status: true,
            data: totalSpent,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.getAverageSpentPerList = async (req, res) => {
    const userId = req.user?.userId;

    try {
        const averageSpent  = await MetricsModel.getAverageSpentPerList({userId});
        res.status(200).json({
            status: true,
            data: averageSpent,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.getMostPurchasedItems = async (req, res) => {
    const userId = req.user?.userId;
    const { limit } = req.query;

    try {
        const items = await MetricsModel.getMostPurchasedItems({userId, limit: parseInt(limit) || 10});

        res.status(200).json({
            status: true,
            data: items,
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
};

exports.getListsCountByPeriod = async (req, res) => {
    const { startDate, endDate } = req.query;
    const userId = req.user?.userId;
    
    if (!startDate ||!endDate) {
        return res.status(400).json({
            status: false,
            message: 'Os períodos de início e fim são necessários'
        });
    }

    try {
        const listCount = await MetricsModel.getListsCountByPeriod({startDate, endDate, userId});

        res.status(200).json({
            status: true,
            data: listCount,
        });
    } catch (error) {
        
    }
};

exports.compareSpendingByCategory = async (req, res) => {
    const { startDate, endDate } = req.body;
    const { userId } = req.params;

    if (!startDate || !endDate) {
        return res.status(400).json({
            status: false,
            message: 'Período deve ser fornecido.'
        });
    }

    try {
        const categories = await ListModel.getSpendingByCategory({ startDate, endDate, userId });
        res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
