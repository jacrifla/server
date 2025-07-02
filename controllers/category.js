const BaseController = require("../utils/BaseController");
const CategoryModel = require("../models/category");

const categoryController = new BaseController(CategoryModel, 'Marca', {
    depTable: 'items',
    depField: 'category_id',
    depError: 'Não é possível excluir a categoria, pois ela está associada a um ou mais itens.',
});

module.exports = {
    createCategory: categoryController.create,
    updateCategory: categoryController.update,
    findAll: categoryController.findAll,
    deleteCategory: categoryController.delete,
};