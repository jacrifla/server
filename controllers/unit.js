const Unit = require('../models/unit');

const unitController = {
    create: async (req, res) => {
        try {
            const { unitName } = req.body;

            if (!unitName) {
                return res.status(400).json({
                    status: false,
                    message: "A unidade de medida é obrigatória." 
                });
            }

            const newUnit = await Unit.create(unitName);
            res.status(201).json({
                status: true,
                message: "Unidade de medida criada com sucesso.",
                data: newUnit
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message 
            });
        }
    },

    findAll: async (req, res) => {
        try {
            const units = await Unit.findAll();
            res.status(200).json({
                status: true,
                data: units
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message 
            });
        }
    },

    findById: async (req, res) => {
        try {
            const { unitId } = req.params;
            const unit = await Unit.findById(unitId);

            if (!unit) {
                return res.status(404).json({ 
                    message: "Unidade de medida não encontrada." 
                });
            }

            res.status(200).json({
                status: true,
                data: unit
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message 
            });
        }
    },

    update: async (req, res) => {
        try {
            const { unitId } = req.params;
            const { unitName } = req.body;

            if (!unitName) {
                return res.status(400).json({ 
                    message: "A unidade de medida é obrigatória." 
                });
            }

            const updatedUnit = await Unit.update(unitId, unitName);

            if (!updatedUnit) {
                return res.status(404).json({ 
                    message: "Unidade de medida não encontrada." 
                });
            }

            res.status(200).json({
                status: true,
                message: "Unidade de medida atualizada com sucesso.",
                data: updatedUnit
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message 
            });
        }
    },

    delete: async (req, res) => {
        try {
            const { unitId } = req.params;
            await Unit.delete(unitId);
            res.status(200).json({
                status: true,
                message: "Unidade de medida excluída com sucesso."
            })
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message 
            });
        }
    }
};

module.exports = unitController;
