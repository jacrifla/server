class BaseController {
    constructor(model, resourceName = 'Recurso', dependencyOptions = null) {
        this.model = model;
        this.resourceName = resourceName;
        this.dependencyOptions = dependencyOptions;
    }

    create = async (req, res) => {
        try {
            const data = req.body;

            if (!Object.values(data).some((val) => val && String(val).trim())) {
                return res.status(400).json({
                    status: false,
                    message: `Campos obrigatórios ausentes para criar ${this.resourceName.toLowerCase()}.`,
                });
            }

            const created = await this.model.create(data);

            return res.status(201).json({
                status: true,
                message: `${this.resourceName} criado com sucesso.`,
                data: created,
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }

    update = async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;

            if (!id || !Object.keys(data).length) {
                return res.status(400).json({
                    status: false,
                    message: `ID e dados são obrigatórios para atualizar ${this.resourceName.toLowerCase()}.`,
                });
            }

            const updated = await this.model.update(id, data);

            return res.status(200).json({
                status: true,
                message: `${this.resourceName} atualizado com sucesso.`,
                data: updated,
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }

    findAll = async (req, res) => {
        try {
            const data = await this.model.findAll();
            return res.status(200).json({
                status: true,
                message: `${this.resourceName}s listados com sucesso.`,
                data,
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }

    delete = async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    status: false,
                    message: `ID é obrigatório para deletar ${this.resourceName.toLowerCase()}.`,
                });
            }

            const deleted = await this.model.delete(id, {
                checkDependency: !!this.dependencyOptions,
                ...this.dependencyOptions,
            });

            return res.status(200).json({
                status: true,
                message: `${this.resourceName} deletado com sucesso.`,
            });
        } catch (err) {
            return res.status(500).json({
                status: false,
                message: err.message,
            });
        }
    }
}

module.exports = BaseController;
