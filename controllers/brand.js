const BaseController = require("../utils/BaseController");
const BrandModel = require("../models/brand");

const brandController = new BaseController(BrandModel, 'Marca', {
    depTable: 'items',
    depField: 'brand_id',
    depError: 'Não é possível excluir a marca, pois ela está associada a um ou mais itens.',
});

module.exports = {
    createBrand: brandController.create,
    updateBrand: brandController.update,
    findAll: brandController.findAll,
    deleteBrand: brandController.delete,
};
