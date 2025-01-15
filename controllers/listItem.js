const ListItemModel = require('../models/listItem');

exports.createItem = async (req, res) => {
    const { listId, itemId, customProduct, quantity, unitPrice } = req.body;

    if (!listId || !quantity) {
        return res.status(400).json({
            status: false,
            message: 'Os campos ID da lista e a quantidade são obrigatórios.'
        });
    }

    if (itemId && customProduct) {
        return res.status(400).json({
            status: false,
            message: 'Não é permitido fornecer itemId e customProduct juntos.'
        });
    }

    if (!itemId && !customProduct) {
        return res.status(400).json({
            status: false,
            message: 'Se ID do item não for fornecido, nome do produto é obrigatório.'
        });
    }

    const itemType = itemId ? 'common' : 'custom';

    try {
        const newItem = await ListItemModel.create({
            listId,
            itemId: itemId || null,
            customProduct: customProduct || null,
            itemType,
            quantity,
            unitPrice: unitPrice || null
        });
        res.status(201).json({
            status: true,
            message: 'Item criado com sucesso.',
            data: newItem
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.updateItem = async (req, res) => {
    const { itemListId } = req.params;
    const { quantity, unitPrice, customProduct } = req.body;

    if (!itemListId) {
        return res.status(400).json({
            status: false,
            message: 'ID do item é obrigatório.'
        });
    }

    try {
        const updatedItem = await ListItemModel.update({
            itemListId,
            quantity,
            unitPrice,
            customProduct
        });

        res.status(200).json({
            status: true,
            message: 'Item atualizado com sucesso.',
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await ListItemModel.delete(req.params.itemListId);
        if (!deletedItem) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado para exclusão.'
            });
        }
        res.status(200).json({
            status: true,
            message: 'Item excluído com sucesso.'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await ListItemModel.getAll();
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
};

exports.getListById = async (req, res) => {
    try {
        const { listId } = req.params;

        if (!listId) {
            return res.status(400).json({
                status: false,
                message: 'ID da lista é obrigatório.'
            });
        };

        const item = await ListItemModel.getByListId(listId);

        if (!item.length) {
            return res.status(404).json({
                status: false,
                message: 'Nenhum item encontrado.'
            });
        }

        res.status(200).json({
            status: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.markAsPurchased = async (req, res) => {
    const { itemListId } = req.params;

    if (!itemListId) {
        return res.status(400).json({
            status: false,
            message: 'ID do item da lista é obrigatório.'
        });
    }

    try {
        const updatedItem = await ListItemModel.markAsPurchased(itemListId);

        res.status(200).json({
            status: true,
            message: 'Item marcado como comprado com sucesso.',
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
