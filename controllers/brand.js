const BrandModel = require('../models/brand');

exports.createBrand = async (req, res) => {
    const { brand_name } = req.body;
    try {
        if (!brand_name) {
            res.status(400).json({
                status: false,
                message: 'O nome é obrigatório'
            });
        };

        const newBrand = await BrandModel.create({ brand_name });
        res.status(201).json({
            status: true,
            message: 'Marca criada com sucesso',
            data: newBrand
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.updateBrand = async (req, res) => {
    const { brand_id } = req.params;
    const { brand_name } = req.body;
    try {
        if (!brand_id || !brand_name) {
            res.status(400).json({
                status: false,
                message: 'ID da marca e o nome são obrigatórios'
            });
        };

        const updatedBrand = await BrandModel.update({ brand_id, brand_name });
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
        };
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
        const brands = await BrandModel.findAll();
        res.status(200).json({
            status: true,
            message: 'Marcas listadas com sucesso',
            data: brands
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.deleteBrand = async (req, res) => {
    const {brand_id} = req.params;

    try {
        if (!brand_id) {
            res.status(400).json({
                status: false,
                message: 'ID da marca é obrigatório'
            });
        };

        const deletedBrand = await BrandModel.delete({ brand_id });

        if (!deletedBrand) {
            res.status(404).json({
                status: false,
                message: 'Marca não encontrada'
            });
        };

        res.status(200).json({
            status: true,
            message: 'Marca deletada com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};