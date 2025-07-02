const BaseModel = require("../utils/BaseModel");

const UnitModel = new BaseModel('units', ['name'], {
    labelMap: {
        id: 'unitId',
        name: 'unitName',
    },
    extraValidation: async ({ name }) => {
        const exists = await UnitModel.recordExists('name', name.trim());
        if (exists) throw new Error("Unidade de medida já existente.");
    },
});

module.exports = UnitModel;