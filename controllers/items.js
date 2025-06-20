const { status } = require('server/reply');
const ItemModel = require('../models/items');
const { isValidBarcode } = require('../utils/validation');

const ItemController = {
    createItem: async (req, res) => {
        const { name, categoryId, brandId, barcode, unitId, userId } = req.body;

        try {
            if (barcode && !isValidBarcode(barcode)) {
                return res.status(400).json({
                    status: false,
                    message: 'O código de barras é inválido'
                });
            }

            const newItem = await ItemModel.createItem(name, categoryId, brandId, barcode, unitId, userId);
            res.status(201).json({
                status: true,
                message: 'Item criado com sucesso',
                data: newItem
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    updateItem: async (req, res) => {
        const { itemId } = req.params;
        const { name, categoryId, brandId, barcode, unitId, updatedBy } = req.body;

        if (isNaN(itemId)) {
            return res.status(400).json({
                status: false,
                message: 'ID do item inválido.'
            });
        }

        try {
            if (barcode && !isValidBarcode(barcode)) {
                return res.status(400).json({
                    status: false,
                    message: 'O código de barras é inválido.'
                });
            }

            const updatedItem = await ItemModel.updateItem(itemId, name, categoryId, brandId, barcode, unitId, updatedBy);
            res.status(200).json({
                status: true,
                message: 'Item atualizado com sucesso',
                data: updatedItem
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    deleteItem: async (req, res) => {
        const { itemId } = req.params;

        if (isNaN(itemId)) {
            return res.status(400).json({
                status: false,
                message: 'ID do item inválido.'
            });
        }

        try {
            const deletedItem = await ItemModel.deleteItem(itemId);
            res.status(200).json({
                status: true,
                data: deletedItem,
                message: 'Item excluído com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    restoreItem: async (req, res) => {
        const { itemId } = req.params;

        if (isNaN(itemId)) {
            return res.status(400).json({
                status: false,
                message: 'ID do item inválido.'
            });
        }

        try {
            const restoredItem = await ItemModel.restoreItem(itemId);
            res.status(200).json({
                status: true,
                data: restoredItem,
                message: 'Item restaurado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },

    getItemByBarcodeName: async (req, res) => {
        const { searchTerm } = req.params;

        try {
            let items = [];

            if (isValidBarcode(searchTerm)) {
                const byBarcode = await ItemModel.getItemByBarcode(searchTerm);
                items = items.concat(byBarcode);
            } else {
                const byName = await ItemModel.getItemByName(searchTerm);
                items = items.concat(byName);
            }

            const uniqueItems = Array.from(new Map(items.map(item => [item.itemId, item])).values());

            res.status(200).json({
                status: true,
                data: uniqueItems,
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    getItemById: async (req, res) => {
        const { itemId } = req.params;

        if (isNaN(itemId)) {
            return res.status(400).json({
                status: false,
                message: 'ID do item inválido.'
            });
        }

        try {
            const item = await ItemModel.getItemById(itemId);

            if (item && item.length > 0) {
                res.status(200).json({
                    status: true,
                    data: item[0],
                });
            } else {
                res.status(404).json({
                    status: false,
                    message: 'Item não encontrado.',
                });
            }
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
            });
        }
    },

    getAllItems: async (req, res) => {
        try {
            const items = await ItemModel.getAllItems();
            res.status(200).json({
                status: true,
                data: items
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message
            });
        }
    },
};

module.exports = ItemController;
