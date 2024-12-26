const ListItemModel = require('../models/listItem');

exports.createItem = async (req, res) => {
    const { list_id, item_id, custom_product, quantity, unit_price } = req.body;

    if (!list_id || !quantity) {
        return res.status(400).json({
            status: false,
            message: 'Os campos ID da lista e a quantidade são obrigatórios.'
        });
    }

    if (item_id && custom_product) {
        return res.status(400).json({
            status: false,
            message: 'Não é permitido fornecer item_id e custom_product juntos.'
        });
    }

    if (!item_id && !custom_product) {
        return res.status(400).json({
            status: false,
            message: 'Se ID do item não for fornecido, nome do produto é obrigatório.'
        });
    }

    const item_type = item_id ? 'common' : 'custom';

    try {
        const newItem = await ListItemModel.create({
            list_id,
            item_id: item_id || null,
            custom_product: custom_product || null,
            item_type,
            quantity,
            unit_price: unit_price || null
        });
        res.status(201).json({
            status: true,
            message: 'Item criado com sucesso.',
            data: newItem
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao criar o item.',
            error: error.message
        });
    }
};

exports.updateItem = async (req, res) => {
    const { list_item_id } = req.params;
    const { quantity, unit_price, custom_product } = req.body;   

    if (!list_item_id) {
        return res.status(400).json({
            status: false,
            message: 'ID do item é obrigatório.'
        });
    }

    try {
        const updatedItem = await ListItemModel.update({
            list_item_id,
            quantity,
            unit_price,
            custom_product
        });

        res.status(200).json({
            status: true,
            message: 'Item atualizado com sucesso.',
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao atualizar o item.',
            error: error.message
        });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await ListItemModel.delete(req.params.listItemId);
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
            message: 'Erro ao excluir o item.',
            error: error.message
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
            message: 'Erro ao buscar itens.',
            error: error.message
        });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await ListItemModel.getById(req.params.listItemId);
        if (!item) {
            return res.status(404).json({
                status: false,
                message: 'Item não encontrado.'
            });
        }
        res.status(200).json({
            status: true,
            data: item
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao buscar item.',
            error: error.message
        });
    }
};

exports.markAsPurchased = async (req, res) => {
    const { list_item_id } = req.params;

    if (!list_item_id) {
        return res.status(400).json({
            status: false,
            message: 'ID do item da lista é obrigatório.'
        });
    }

    try {
        const updatedItem = await ListItemModel.markAsPurchased(list_item_id);

        res.status(200).json({
            status: true,
            message: 'Item marcado como comprado com sucesso.',
            data: updatedItem
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Erro ao marcar o item como comprado.',
            error: error.message
        });
    }
};
