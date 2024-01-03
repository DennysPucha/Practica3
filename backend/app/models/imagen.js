"use strict";

module.exports = (sequelize, DataTypes) => {
    const imagen = sequelize.define('imagen', {
        nombre: {  type: DataTypes.STRING(400), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true });
    imagen.associate=function(models){
        imagen.belongsTo(models.auto,{
            foreignKey:'id_auto'
        });
    };
    
    return imagen;
    
};