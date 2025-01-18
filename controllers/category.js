const CategoryModel = require('../models/category');


const CategoryController = {
    createCategory: async (req, res) => {
        const { categoryName } = req.body;

        try {
            if (!categoryName) {
                return res.status(400).json({
                    status: false,
                    message: 'O nome da categoria é obrigatório'
                });
            };

            const newCategory = await CategoryModel.create(categoryName);

            res.status(201).json({
                status: true,
                message: 'Categoria criada com sucesso',
                data: newCategory
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    findAll: async (req, res) => {
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
                message: error.message,
            });
        }
    },

    updateCategory: async (req, res) => {
        const { categoryId } = req.params;
        const { categoryName } = req.body;

        try {
            if (!categoryId || !categoryName) {
                return res.status(400).json({
                    status: false,
                    message: 'ID da categoria e o nome da categoria são obrigatórios'
                });
            };

            const updateCategory = await CategoryModel.update(categoryId, categoryName);

            res.status(200).json({
                status: true,
                message: 'Categoria atualizada com sucesso',
                data: updateCategory
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    deleteCategory: async (req, res) => {
        const { categoryId } = req.params;

        try {
            if (!categoryId) {
                return res.status(400).json({
                    status: false,
                    message: 'ID da categoria é obrigatório'
                });
            };

            const deleteCategory = await CategoryModel.delete(categoryId);

            if (!deleteCategory) {
                return res.status(404).json({
                    status: false,
                    message: 'Categoria não encontrada ou excluída'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Categoria excluída com sucesso',
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    }
};

module.exports = CategoryController;