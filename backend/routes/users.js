'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PersonaController = require('../app/controls/PersonaControl');
const RolController = require('../app/controls/RolControl');
const CuentaController = require('../app/controls/CuentaControl');
const VentaController=require('../app/controls/VentaControl');
const AutoController=require('../app/controls/AutoControl');


const personaController = new PersonaController();
const rolController = new RolController();
const cuentaController = new CuentaController();
const ventaController=new VentaController();
const autoController=new AutoController();

const authMiddleware = async (req, res, next) => {
    const token = req.headers['token-autos'];

    if (!token) {
        res.status(401);
        res.json({ message: "Falta Token", code: 401 });
    } else {
        require('dotenv').config();
        const key = process.env.KEY_SEC;

        try {
            const decoded = jwt.verify(token, key);
            console.log(decoded.external);

            const models = require('../app/models');
            const cuenta = models.cuenta;
            const aux = await cuenta.findOne({
                where: { external_id: decoded.external }
            });

            if (!aux) {
                res.status(401);
                res.json({ message: "ERROR", tag: 'Token no válido', code: 401 });
            } else {
                next();
            }
        } catch (err) {
            res.status(401);
            res.json({ message: "ERROR", tag: 'Token no válido o expirado', code: 401 });
        }
    }
};

/* GET users listing. */
router.get('/', (req, res) => {
    res.send('respond with a resource');
});

router.get('/listar/roles', rolController.listar);
router.post('/guardar/roles', rolController.guardar);

router.post('/iniciar_sesion', cuentaController.inicio_sesion);
router.get('/listar/cuentas', cuentaController.listar);


router.get('/listar/personas',authMiddleware, personaController.listar);
router.post('/modificar/personas/:external',authMiddleware, personaController.modificar);
router.post('/guardar/personas', personaController.guardar);
router.get('/obtener/personas/:external',authMiddleware, personaController.obtener);


//AGENTE
router.get('/agente/listar/ventas',authMiddleware, ventaController.listar);
router.post('/agente/modificar/ventas/:external',authMiddleware, ventaController.modificar);
router.post('/agente/guardar/ventas',authMiddleware, ventaController.guardar);
router.get('/agente/obtener/venta/:external',authMiddleware, ventaController.obtener);
router.get('/agente/obtener/ventas/:external',authMiddleware, personaController.obtenerVentas);


//GERENTE
router.get('/gerente/obtener/imagenes/:external',authMiddleware, autoController.obtenerImagenes);
router.get('/gerente/listar/autos',authMiddleware, autoController.listar);
router.get('/gerente/listar/autos/sinVender',authMiddleware, autoController.listarSinVender);
router.post('/gerente/modificar/autos/:external',authMiddleware, autoController.modificar);
router.post('/gerente/guardar/autos',authMiddleware, autoController.guardar);
router.get('/gerente/obtener/autos/:external',authMiddleware, autoController.obtener);
router.post('/gerente/guardar/ImageAuto/:external',authMiddleware, autoController.guardarImagenes);
module.exports = router;
