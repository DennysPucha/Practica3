"use strict";



module.exports = (sequelize, DataTypes) => {
    const auto = sequelize.define('auto', {
        color: { type: DataTypes.STRING(300),defaultValue: "NONE" },
        marca: { type: DataTypes.STRING(300),defaultValue: "NONE" },
        matricula: { type: DataTypes.STRING(100),unique:true},
        fecha_fabricacion: { type: DataTypes.DATEONLY },
        recorrido: { type: DataTypes.DOUBLE, defaultValue:0.0},
        precio: { type: DataTypes.DOUBLE, defaultValue:0.0},
        estado: {type:DataTypes.BOOLEAN,defaultValue:false},
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true });
    auto.associate=function(models){
        auto.belongsTo(models.persona,{
            foreignKey:'id_persona'});
        auto.hasMany(models.imagen, { 
            foreignKey:'id_auto',as: 'imagen'
            });
    };
    return auto;
};