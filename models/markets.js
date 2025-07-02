const BaseModel = require("../utils/BaseModel");

const MarketModel = new BaseModel('markets', ['name'], {
    labelMap: {
        name: 'marketName',
        id: 'marketId',
    },
    extraValidation: async ({ name }) => {
        const exists = await MarketModel.recordExists('name', name.trim());
        if (exists) throw new Error("Mercado já existente.");
    },
});

module.exports = MarketModel;