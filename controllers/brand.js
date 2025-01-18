const BrandModel = require('../models/brand');

const BrandController = {
    createBrand: async (req, res) => {
        const { brandName } = req.body;
        try {
            if (!brandName) {
                return res.status(400).json({
                    status: false,
                    message: 'O nome é obrigatório'
                });
            }

            const newBrand = await BrandModel.create(brandName);
            res.status(201).json({
                status: true,
                message: 'Marca criada com sucesso',
                data: newBrand
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    updateBrand: async (req, res) => {
        const { brandId } = req.params;
        const { brandName } = req.body;

        try {
            if (!brandId || !brandName) {
                return res.status(400).json({
                    status: false,
                    message: 'ID da marca e o nome são obrigatórios'
                });
            }

            const updatedBrand = await BrandModel.update(brandId, brandName);
            if (updatedBrand) {
                res.status(200).json({
                    status: true,
                    message: 'Marca atualizada com sucesso',
                    data: updatedBrand
                });
            } else {
                res.status(404).json({
                    status: false,
                    message: 'Marca não encontrada'
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    findAll: async (req, res) => {
        try {
            const brands = await BrandModel.findAll();
            res.status(200).json({
                status: true,
                message: 'Marcas listadas com sucesso',
                data: brands
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    deleteBrand: async (req, res) => {
        const { brandId } = req.params;

        try {
            if (!brandId) {
                return res.status(400).json({
                    status: false,
                    message: 'ID da marca é obrigatório'
                });
            }

            const deletedBrand = await BrandModel.delete(brandId);

            if (!deletedBrand) {
                return res.status(404).json({
                    status: false,
                    message: 'Marca não encontrada'
                });
            }

            res.status(200).json({
                status: true,
                message: 'Marca deletada com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
};

module.exports = BrandController;