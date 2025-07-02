const BaseController = require("../utils/BaseController");
const MarketModel = require("../models/markets");

const marketController = new BaseController(MarketModel, 'Marca', {
    depTable: 'items',
    depField: 'market_id',
    depError: 'Não é possível excluir o mercado, pois ele está associada a um ou mais itens.',
});

module.exports = {
    createMarket: marketController.create,
    updateMarket: marketController.update,
    findAll: marketController.findAll,
    deleteMarket: marketController.delete,
};
