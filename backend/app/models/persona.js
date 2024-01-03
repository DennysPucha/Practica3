"use strict";

module.exports = (sequelize, DataTypes) => {
    const Persona = sequelize.define('persona', {
        nombres: { type: DataTypes.STRING(150), defaultValue: "NONE" },
        apellidos: { type: DataTypes.STRING(15), defaultValue: "NONE" },
        direccion: { type: DataTypes.STRING, defaultValue: "NONE" },
        cedula: { type: DataTypes.STRING(20), defaultValue: "NONE" },
        external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
    }, { freezeTableName: true });

    Persona.associate = function (models) {
        Persona.hasOne(models.cuenta, {
            foreignKey: 'id_persona',
            as: 'cuenta'
        });

        Persona.belongsToMany(models.auto, {
            through: 'PersonaAuto'
        });

        Persona.belongsTo(models.rol, {
            foreignKey: 'id_rol',
            as: 'rol'
        });

        Persona.hasMany(models.venta, {
            foreignKey: 'id_persona',
            as: 'ventas' 
        });
    };

    return Persona;
};