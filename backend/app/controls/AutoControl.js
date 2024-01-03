'use strict';

const models = require('../models');
const formidable = require('formidable');
const fs = require('fs');
const formatosPermitidos = ['png', 'jpg', 'jepg'];
const Auto = models.auto;
const Persona = models.persona;
const Venta = models.venta;
const uuid = require('uuid');

class AutoControl {

    async obtener(req, res) {
        try {
            const external = req.params.external;
            const lista = await Auto.findOne({
                where: { external_id: external },
                include: [
                    { model: models.imagen, as: 'imagen', attributes: ['nombre', 'external_id'] },
                ],
                attributes: ['color', 'marca', 'matricula', 'fecha_fabricacion', 'recorrido', 'precio', 'estado', 'external_id']
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
            const lista = await Auto.findAll({
                include: [
                    { model: models.imagen, as: 'imagen', attributes: ['nombre', 'external_id'] },
                ],
                attributes: ['color', 'marca', 'matricula', 'fecha_fabricacion', 'recorrido', 'precio', 'estado', 'external_id']
            });

            res.status(200).json({ message: "OK", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async listarSinVender(req, res) {
        try {
            const lista = await Auto.findAll({
                include: [
                    { model: models.imagen, as: 'imagen', attributes: ['nombre', 'external_id'] },
                ],
                attributes: ['color', 'marca', 'matricula', 'fecha_fabricacion', 'recorrido', 'precio', 'estado', 'external_id'],
                where: {
                    estado: false
                }
            });

            res.status(200).json({ message: "OK", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async guardar(req, res) {
        try {
            const { color, marca, matricula, fecha_fabricacion, recorrido, precio, persona } = req.body;

            if (!(color && marca && matricula && fecha_fabricacion && recorrido && persona && precio)) {
                res.status(400).json({ message: "ERROR", tag: "Faltan datos", code: 400 });
                return;
            }


            const perA = await Persona.findOne({
                where: { external_id: persona },
                include: [
                    { model: models.rol, as: 'rol', attributes: ['nombre'] },
                ],
            });

            if (!perA) {
                res.status(401).json({ message: "ERROR", tag: "No se encuentra el agente", code: 401 });
            } else {
                const data = {
                    color,
                    marca,
                    matricula,
                    fecha_fabricacion,
                    recorrido,
                    precio,
                    persona,
                    id_persona: perA.id,
                };

                if (perA.rol.nombre == 'Gerente') {
                    const result = await Auto.create(data);
                    if (!result) {
                        res.status(401).json({ message: "ERROR", tag: "No se puede crear", code: 401 });
                    } else {
                        const { external_id } = result;
                        console.log(result);
                        res.status(200).json({ message: "EXITO", code: 200, external_id });
                    }
                } else {
                    res.status(400).json({ message: "ERROR", tag: "La persona que está ingresando a la venta no posee el rol de gerente" });

                }
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async modificar(req, res) {
        try {
            const external = req.params.external;

            const { color, marca, matricula, fecha_fabricacion, recorrido, precio, estado, persona } = req.body;

            if (!(color && marca && matricula && fecha_fabricacion && recorrido && persona && precio && estado)) {
                res.status(400).json({ message: "ERROR", tag: "Faltan datos", code: 400 });
                return;
            }

            const uuid = require('uuid');

            const autoA = await Auto.findOne({ where: { external_id: external } });

            if (!autoA) {
                res.status(404).json({ message: "ERROR", tag: "Registro no encontrado", code: 404 });
                return;
            }

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

                const data = {
                    color,
                    marca,
                    matricula,
                    fecha_fabricacion,
                    recorrido,
                    precio,
                    persona,
                    estado,
                    id_persona: perA.id,
                };

                if (perA.rol.nombre == 'Gerente') {
                    const result = await autoA.update(data);
                    if (!result) {
                        res.status(401).json({ message: "ERROR", tag: "No se puede crear", code: 401 });
                    } else {
                        autoA.external_id = uuid.v4();
                        await autoA.save();
                        res.status(200).json({ message: "OK", code: 200 });
                    }
                } else {
                    res.status(400).json({ message: "ERROR", tag: "La persona que está ingresando a la venta no posee el rol de gerente" });
                }
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async guardarImagenes(req, res) {
        const external_id = req.params.external;

        try {
            const autoA = await models.auto.findOne({
                where: { external_id: external_id },
            });

            if (!autoA) {
                return res.status(404).json({
                    success: false,
                    message: "Auto no encontrado",
                    error: { code: 404 }
                });
            }

            var form = new formidable.IncomingForm();
            const files = [];

            await new Promise((resolve, reject) => {
                form.on('file', function (field, file) {
                    files.push(file);
                }).on('end', function () {
                    resolve();
                });
                form.parse(req, function (err, fields) {
                    if (err) reject(err);
                });
            });
            for (const key in files) {
                if (Object.hasOwnProperty.call(files, key)) {
                    const file = files[key];

                    const extension = file.originalFilename.split('.').pop().toLowerCase();

                    if (!formatosPermitidos.includes(extension)) {
                        return res.status(400).json({
                            success: false,
                            message: "Formato de imagen no válido",
                            error: { code: 400 }
                        });
                    }

                    const contadorImagenes = await models.imagen.count({
                        where: { id_auto: autoA.id }
                    });

                    if (contadorImagenes >= 3) {
                        return res.status(400).json({
                            success: false,
                            message: "Máximo número de imágenes alcanzados para el auto",
                            error: { code: 400 }
                        });
                    } else {
                        try {
                            const fileName = 'imagen_' + Math.floor(Math.random() * 1000000);

                            const imageData = {
                                nombre: fileName + '.' + extension,
                                external_id: uuid.v4(),
                                id_auto: autoA.id,
                            };

                            await models.imagen.create(imageData);

                            await fs.rename(file.filepath, 'public/multimedia/' + fileName + '.' + extension, (err) => {
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({
                                        success: false,
                                        message: "Error al guardar la imagen",
                                        error: { code: 500 }
                                    });
                                }
                            });
                        } catch (err) {
                            console.error(err);
                            return res.status(500).json({
                                success: false,
                                message: "Error al guardar la imagen",
                                error: { code: 500 }
                            });
                        }
                    }
                }
            }

            res.status(200).json({ success: true, message: "Images uploaded successfully", data: { external_id } });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: { code: 500 }
            });
        }
    }

    async obtenerImagenes(req, res) {
        const external_id = req.params.external;

        try {
            const autoA = await models.auto.findOne({
                where: { external_id: external_id },
                include: [
                    { model: models.imagen, as: 'imagen', attributes: ['nombre', 'external_id'] },
                ],
            });

            if (!autoA) {
                return res.status(404).json({
                    success: false,
                    message: "Auto no encontrado",
                    error: { code: 404 }
                });
            }

            const nombresImagenes = autoA.imagen.map((imagen) => imagen.nombre);

            res.status(200).json({ success: true, data: nombresImagenes });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
                error: { code: 500 }
            });
        }
    }

}

module.exports = AutoControl;
