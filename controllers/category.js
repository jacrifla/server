const CategoryModel = require('../models/category');

exports.createCategory = async (req, res) => {
    const { category_name } = req.body;
    try {
        if (!category_name) {
            return res.status(400).json({
                status: false,
                message: 'O nome da categoria é obrigatório'
            });
        };
        const newCategory = await CategoryModel.create({ category_name });
        res.status(201).json({
            status: true,
            message: 'Categoria criada com sucesso',
            data: newCategory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.findAll = async (req, res) => {
    try {
        const categories = await CategoryModel.findAll();
        res.status(200).json({
            status: true,
            message: 'Categorias encontradas com sucesso',
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.updateCategory = async (req, res) => {
    const { category_id } = req.params;
    const { category_name } = req.body;
    try {
        if (!category_id ||!category_name) {
            return res.status(400).json({
                status: false,
                message: 'ID da categoria e o nome da categoria são obrigatórios'
            });
        };
        
        const updateCategory = await CategoryModel.update({category_id, category_name});

        res.status(200).json({
            status: true,
            message: 'Categoria atualizada com sucesso',
            data: updateCategory
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};