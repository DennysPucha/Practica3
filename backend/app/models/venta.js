"use strict";



module.exports = (sequelize, DataTypes) => {
    const venta = sequelize.define('venta', {
        fecha: { type: DataTypes.DATEONLY },
        descripcion: { type: DataTypes.STRING(500), defaultValue: "NONE" },
        total: { type: DataTypes.DOUBLE, defaultValue: 0.0 },
        cliente: { type: DataTypes.STRING(100), defaultValue: "NONE" },
        cedula: { type: DataTypes.STRING(20), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, {freezeTableName: true });
    venta.associate=function(models){
        venta.belongsTo(models.persona,{
            foreignKey:'id_persona'
        });
        venta.belongsTo(models.auto,{
            foreignKey:'id_auto'
        });
    };
    return venta;
};