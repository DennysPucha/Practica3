'use strict';

const models = require('../models');
const { venta, auto, persona, rol, cuenta, sequelize } = models;
const uuid = require('uuid');

class PersonaControl {

    async obtener(req, res) {
        const external = req.params.external;

        try {
            const lista = await persona.findOne({
                where: { external_id: external },
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['usuario'] },
                    { model: rol, as: 'rol', attributes: ['nombre'] },
                    { model: venta, as: 'ventas', attributes: ['fecha', 'descripcion', 'total', 'cliente', 'cedula', 'external_id']},
                ],
                attributes: ['nombres', 'apellidos', 'direccion', 'cedula', 'external_id']
            });

            if (!lista) {
                res.status(404);
                return res.json({ message: "Recurso no encontrado", code: 404, data: {} });
            }

            res.status(200);
            res.json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtenerVentas(req, res) {
        const external = req.params.external;

        try {
            const lista = await persona.findOne({
                where: { external_id: external },
                include: [
                    { model: venta, as: 'ventas', attributes: ['fecha', 'descripcion', 'total', 'cliente', 'cedula', 'external_id']
                    ,include:[
                        {
                            model: models.auto, as: 'auto', include: [
                                { model: models.imagen, as: 'imagen', attributes: ['nombre', 'external_id'] }
                            ], attributes: ['matricula', 'color', 'marca', 'precio', 'estado', 'external_id'],
                        },
                    ],
                    },
                ],
                attributes: ['nombres', 'apellidos', 'direccion', 'cedula', 'external_id']
            });

            if (!lista) {
                res.status(404);
                return res.json({ message: "Recurso no encontrado", code: 404, data: {} });
            }

            res.status(200);
            res.json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async listar(req, res) {
        try {
            const lista = await persona.findAll({
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['usuario'] },
                    { model: rol, as: 'rol', attributes: ['nombre'] },
                    { model: venta, as: 'ventas', attributes: ['fecha', 'descripcion', 'total', 'cliente', 'cedula', 'external_id']},
                ],
                attributes: ['nombres', 'apellidos', 'direccion', 'cedula', 'external_id']
            });

            res.status(200);
            res.json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async guardar(req, res) {
        const { nombres, apellidos, direccion, cedula, usuario, clave, rol: rolId } = req.body;

        if (nombres && apellidos && direccion && cedula && usuario && clave && rolId) {
            try {
                const rolA = await rol.findOne({ where: { external_id: rolId } });

                if (!rolA) {
                    res.status(400);
                    return res.json({ message: "Error de solicitud", tag: "Rol no existente", code: 400 });
                }

                const data = {
                    nombres,
                    apellidos,
                    cedula,
                    direccion,
                    external_id: uuid.v4(),
                    id_rol: rolA.id,
                    cuenta: {
                        usuario: usuario,
                        clave
                    }
                };

                const transaction = await sequelize.transaction();

                try {
                    const result = await persona.create(data, { include: [{ model: cuenta, as: "cuenta" }], transaction });
                    
                    await transaction.commit();

                    if (!result) {
                        res.status(401);
                        return res.json({ message: "Error de autenticación", tag: "No se puede crear", code: 401 });
                    }

                    res.status(200);
                    res.json({ message: "Éxito", code: 200 });
                } catch (error) {
                    await transaction.rollback();
                    res.status(203);
                    res.json({ message: "Error de procesamiento", code: 203, error: error.message });
                }
            } catch (error) {
                res.status(500);
                res.json({ message: "Error interno del servidor", code: 500, error: error.message });
            }
        } else {
            res.status(400);
            res.json({ message: "Error de solicitud", tag: "Datos incorrectos", code: 400 });
        }
    }

    async modificar(req, res) {
        const { nombres, apellidos, direccion, cedula, usuario, clave, rol: rolId } = req.body;
        const external = req.params.external;

        if (nombres && apellidos && direccion && cedula && usuario && clave && rolId) {
            try {
                const personaA = await persona.findOne({ where: { external_id: external } });

                if (!personaA) {
                    res.status(404);
                    return res.json({ message: "Error de solicitud", tag: "Registro no encontrado", code: 404 });
                }

                const rolA = await rol.findOne({ where: { external_id: rolId } });

                if (!rolA) {
                    res.status(400);
                    return res.json({ message: "Error de solicitud", tag: "Rol no existente", code: 400 });
                }

                const data = {
                    nombres,
                    apellidos,
                    cedula,
                    direccion,
                    id_rol: rolA.id,
                    cuenta: {
                        usuario: usuario,
                        clave
                    },
                };

                const transaction = await sequelize.transaction();

                try {
                    await personaA.update(data, {
                        include: [{ model: cuenta, as: "cuenta" }],
                        transaction,
                    });
                    await transaction.commit();

                    res.status(200);
                    res.json({ message: "Éxito", code: 200 });

                } catch (error) {
                    await transaction.rollback();

                    res.status(203);
                    res.json({ message: "Error de procesamiento", code: 203, error: error.message });
                }
            } catch (error) {
                res.status(500);
                res.json({ message: "Error interno del servidor", code: 500, error: error.message });
            }
        } else {
            res.status(400);
            res.json({ message: "Error de solicitud", tag: "Datos incorrectos", code: 400 });
        }
    }

}

module.exports = PersonaControl;
