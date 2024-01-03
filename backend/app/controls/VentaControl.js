'use strict';

const models = require('../models');
const formidable = require('formidable');
const fs = require('fs');

const Persona = models.persona;
const Venta = models.venta;

class VentaControl {
    async obtener(req, res) {
        try {
            const external = req.params.external;
            const lista = await Venta.findOne({
                where: { external_id: external },
                include: [
                    { model: models.persona, as: 'persona', attributes: ['apellidos', 'nombres'] },
                    {
                        model: models.auto, as: 'auto', include: [
                            { model: models.imagen, as: 'imagen', attributes: ['nombre', 'external_id'] }
                        ], attributes: ['matricula', 'color', 'marca', 'precio', 'estado', 'external_id'],
                    },
                ],
                attributes: ['fecha', 'descripcion', 'total', 'cliente', 'cedula', 'external_id']
            });

            if (!lista) {
                res.status(404).json({ message: "No encontrado", code: 404, data: {} });
            } else {
                res.status(200).json({ message: "OK", code: 200, data: lista });
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async listar(req, res) {
        try {
            const lista = await Venta.findAll({
                include: [
                    { model: models.persona, as: 'persona', attributes: ['apellidos', 'nombres'] },
                    {
                        model: models.auto, as: 'auto', include: [
                            { model: models.imagen, as: 'imagen', attributes: ['nombre', 'external_id'] }
                        ], attributes: ['matricula', 'color', 'marca', 'precio', 'estado', 'external_id'],
                    },
                ],
                attributes: ['fecha', 'descripcion', 'total', 'cliente', 'cedula', 'external_id']
            });

            res.status(200).json({ message: "OK", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async guardar(req, res) {
        try {
            const { fecha, descripcion, total, cliente, cedula, persona, auto } = req.body;

            if (!(fecha && descripcion && total && cliente && cedula && persona && auto)) {
                res.status(400).json({ message: "ERROR", tag: "Faltan datos", code: 400 });
                return;
            }

            const uuid = require('uuid');

            const autoA = await models.auto.findOne({
                where: { external_id: auto },
                include: [
                    { model: models.imagen, as: 'imagen', attributes: ['nombre'] },
                ],
            });

            const perA = await Persona.findOne({
                where: { external_id: persona },
                include: [
                    { model: models.rol, as: 'rol', attributes: ['nombre'] },
                ],
            });

            if (!perA) {
                res.status(401).json({ message: "ERROR", tag: "No se encuentra el agente", code: 401 });
            } else if (!autoA) {
                res.status(401).json({ message: "ERROR", tag: "No se encuentra el auto", code: 401 });
            } else {
                if (autoA.estado == true) {
                    res.status(401).json({ message: "ERROR", tag: "El auto ya ha sido vendido" });
                } else {
                    const dataAuto = {
                        estado: true,
                    };
                    const data = {
                        fecha,
                        external_id: uuid.v4(),
                        descripcion,
                        total,
                        cliente,
                        cedula,
                        id_persona: perA.id,
                        id_auto: autoA.id
                    };

                    if (perA.rol.nombre == 'Agente') {
                        const result = await Venta.create(data);
                        await autoA.update(dataAuto);

                        if (!result) {
                            res.status(401).json({ message: "ERROR", tag: "No se puede crear", code: 401 });
                        } else {
                            autoA.external_id = uuid.v4();
                            await autoA.save();
                            res.status(200).json({ message: "EXITO", code: 200 });
                        }
                    } else {
                        res.status(400).json({ message: "ERROR", tag: "La persona que está ingresando a la venta no posee el rol de agente" });
                    }
                }
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async modificar(req, res) {
        try {
            const external = req.params.external;

            const { fecha, descripcion, total, cliente, cedula, persona, auto } = req.body;

            if (!(fecha && descripcion && total && cliente && cedula && persona && auto)) {
                res.status(400).json({ message: "ERROR", tag: "Faltan datos", code: 400 });
                return;
            }

            const uuid = require('uuid');

            const ventaA = await Venta.findOne({ where: { external_id: external } });

            if (!ventaA) {
                res.status(404).json({ message: "ERROR", tag: "Registro no encontrado", code: 404 });
                return;
            }

            const autoA = await models.auto.findOne({
                where: { external_id: auto },
                include: [
                    { model: models.imagen, as: 'imagen', attributes: ['nombre'] },
                ],
            });

            const perA = await Persona.findOne({
                where: { external_id: persona },
                include: [
                    { model: models.rol, as: 'rol', attributes: ['nombre'] },
                ],
            });

            if (!perA) {
                res.status(401).json({ message: "ERROR", tag: "No se encuentra el agente", code: 401 });
            } else if (!autoA) {
                res.status(401).json({ message: "ERROR", tag: "No se encuentra el documento", code: 401 });
            } else {
                const dataAuto = {
                    estado: true,
                };
                const data = {
                    fecha,
                    external_id: uuid.v4(),
                    descripcion,
                    total,
                    cliente,
                    cedula,
                    id_persona: perA.id,
                    id_auto: autoA.id
                };

                if (perA.rol.nombre == 'Agente') {
                    const result = await ventaA.update(data);
                    await autoA.update(dataAuto);

                    if (!result) {
                        res.status(401).json({ message: "ERROR", tag: "No se puede crear", code: 401 });
                    } else {
                        autoA.external_id = uuid.v4();
                        await autoA.save();
                        res.status(200).json({ message: "OK", code: 200 });
                    }
                } else {
                    res.status(400).json({ message: "ERROR", tag: "La persona que está ingresando a la venta no posee el rol de agente" });
                }
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }
}

module.exports = VentaControl;
