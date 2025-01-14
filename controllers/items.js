const ItemNotesModel = require('../models/itemNotes');
const ItemModel = require('../models/items');
const { isValidBarcode } = require('../utils/validation');

exports.createItem = async (req, res) => {
    const { productName, categoryId, brandId, barcode, note, userId } = req.body;    

    try {
        if (!productName || !categoryId || !brandId) {
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

        // Criar o item
        const newItem = await ItemModel.create({
            productName,
            categoryId,
            brandId,
            barcode
        });

        // Se houver uma nota, criar a nota associada ao item
        if (note && userId) {
            await ItemNotesModel.createNote({
                userId,
                itemId: newItem.itemId,
                note
            });
        }

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
    const { itemId } = req.params;
    const { productName, categoryId, brandId, barcode, note, userId } = req.body;

    try {
        if (!itemId) {
            return res.status(400).json({
                status: false,
                message: 'ID do item é necessário'
            });
        }

        if (barcode && !isValidBarcode(barcode)) {
            return res.status(400).json({
                status: false,
                message: 'O código de barras é inválido'
            });
        }

        // Atualizar o item
        const updatedItem = await ItemModel.update({
            itemId,
            productName,
            categoryId,
            brandId,
            barcode,
            note,
            userId
        });

        if (!updatedItem) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado para atualizar'
            });
        }

        // Retornar a resposta com o item atualizado, incluindo note e userId
        return res.status(200).json({
            status: true,
            message: 'Item atualizado com sucesso',
            data: updatedItem
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
    const { itemId } = req.params;

    try {
        if (!itemId) {
            return res.status(400).json({
                status: false,
                message: 'ID do item é necessário'
            });
        }

        const deleteItem = await ItemModel.delete({ itemId });

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
    const { itemId } = req.params;

    try {
        if (!itemId) {
            return res.status(400).json({
                status: false,
                message: 'ID do item é necessário'
            });
        }

        const item = await ItemModel.findById({ itemId });

        if (!item) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado'
            });
        }

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
    const { productName } = req.query;

    if (!productName || productName.trim() === '') {
        return res.status(400).json({
            status: false,
            message: 'Nome do item é necessário e não pode ser vazio'
        });
    }

    try {
        if (typeof productName !== 'string') {
            throw new Error('Parâmetro productName deve ser uma string');
        }

        const items = await ItemModel.findItemsByName({ productName });

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
    }

    try {
        const item = await ItemModel.findItemByBarcode({ barcode });

        if (!item) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado'
            });
        }

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
    const { limit = 10, offset = 0 } = req.query;

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
