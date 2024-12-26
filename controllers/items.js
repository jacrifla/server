const ItemModel = require('../models/items');
const { isValidBarcode } = require('../utils/validation');

exports.createItem = async (req, res) => {
    const { product_name, category_id, brand_id, barcode } = req.body;

    try {
        if (!product_name || !category_id || !brand_id) {
            return res.status(400).json({
                status: false,
                message: 'Todos os dados obrigatórios devem ser fornecidos'
            });
        }

        if (barcode && !isValidBarcode(barcode)) {
            return res.status(400).json({
                status: false,
                message: 'O código de barras é inválido'
            });
        }

        const newItem = await ItemModel.create({ 
            product_name, 
            category_id, 
            brand_id, 
            barcode 
        });

        res.status(201).json({
            status: true,
            message: 'Item criado com sucesso',
            data: newItem
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.updateItem = async (req, res) => {
    const { item_id } = req.params;
    const { product_name, category_id, brand_id, barcode } = req.body;

    try {
        if (!item_id) {
            return res.status(400).json({
                status: false,
                message: 'ID do item é necessário'
            });
        };

        if (barcode && !isValidBarcode(barcode)) {
            return res.status(400).json({
                status: false,
                message: 'O código de barras é inválido'
            });
        };

        const [updatedRows] = await ItemModel.update(
            { product_name, category_id, brand_id, barcode },
            { where: { item_id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado para atualizar'
            });
        }

        return res.status(200).json({
            status: true,
            message: 'Item atualizado com sucesso'
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
        const items = await ItemModel.findAll();
        res.status(200).json({
            status: true,
            message: 'Itens listados com sucesso',
            data: items
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.deleteItem = async (req, res) => {
    const { item_id } = req.params;

    try {
        if (!item_id) {
            return res.status(400).json({
                status: false,
                message: 'ID do item é necessário'
            });
        };

        const deleteItem = await ItemModel.destroy({
            where: { item_id }
        });

        if (deleteItem === 0) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado ou já excluído'
            });
        }
        
        res.status(200).json({
            status: true,
            message: 'Item excluído com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.findById = async (req, res) => {
    const { item_id } = req.params;

    try {
        if (!item_id) {
            return res.status(400).json({
                status: false,
                message: 'ID do item é necessário'
            });
        };
        
        const item = await ItemModel.findById({ item_id });

        if (!item) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado'
            });
        };

        res.status(200).json({
            status: true,
            message: 'Item encontrado com sucesso',
            data: item
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.searchByName = async (req, res) => {
    const { product_name } = req.query;
    
    if (!product_name || product_name.trim() === '') {
        return res.status(400).json({
            status: false,
            message: 'Nome do item é necessário e não pode ser vazio'
        });
    }    

    try {
        if (typeof product_name !== 'string') {
            throw new Error('Parâmetro product_name deve ser uma string');
        }

        const items = await ItemModel.findItemsByName({ product_name });
        // console.log('ITEMS: ', items);
        
        
        res.status(200).json({
            status: true,
            message: 'Itens encontrados com sucesso',
            data: items
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.searchByBarcode = async (req, res) => {
    const { barcode } = req.query;

    if (!barcode) {
        return res.status(400).json({
            status: false,
            message: 'Código de barras é necessário'
        });
    };

    try {
        const item = await ItemModel.findItemByBarcode({barcode});

        if (!item) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado'
            });
        };

        res.status(200).json({
            status: true,
            message: 'Item encontrado com sucesso',
            data: item
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};

exports.searchAllWithPagination = async (req, res) => {
    const { limit = 10, offset = 0} = req.query;

    try {
        const items = await ItemModel.findAllWithPagination(Number(limit), Number(offset));
        
        res.status(200).json({
            status: true,
            message: 'Itens encontrados com sucesso',
            data: items
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Ocorreu um erro interno',
            error: error.message
        });
    }
};