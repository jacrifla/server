const BaseController = require("../utils/BaseController");
const UnitModel = require("../models/unit");

const unitController = new BaseController(UnitModel, 'Unidade de medida', {
    depTable: 'items',
    depField: 'unit_id',
    depError: 'Não é possível excluir a unidade, pois ela está associada a um ou mais itens.',
});

module.exports = {
    createUnit: unitController.create,
    updateUnit: unitController.update,
    findAll: unitController.findAll,
    deleteUnit: unitController.delete,
};