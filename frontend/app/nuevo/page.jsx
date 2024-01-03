"use client";
import MenuAdminEdit from "@/componentes/menuAdminEdit";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import React from 'react';
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { useState } from "react";
import { obtenerTodo } from "@/hooks/Conexion";
import { useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button } from 'react-bootstrap';
import { enviar } from "@/hooks/Conexion";
import mensajes from "@/componentes/mensajes";
export default function Page() {
    const [autos, setautos] = useState([]);
    const [autoSeleccionado, setAutoSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        const obtenerAuto = async () => {
            try {
                const token = getToken()
                const response = await obtenerTodo('gerente/listar/autos/sinVender', token);
                console.log(response);
                const resultado = response.data;
                setautos(resultado)

            } catch (error) {
                console.error('Error:', error);
            }
        };

        obtenerAuto();
    }, []);
    const validacionColores = ['Plata', 'Blanco', 'Azul (250$ adicional)', 'Rojo (300$ adicional)'];

    const [selectedDate, setSelectedDate] = useState(null);

    const validationSchema = Yup.object().shape({
        fecha: Yup.string().required('Ingrese una fecha'),
        descripcion: Yup.string().required('Ingrese el valor descripcion'),
        total: Yup.string().required('Ingrese el total'),
        cliente: Yup.string().required('Ingrese el cliente'),
        cedula: Yup.string().required('Ingrese una cedula'),
        color: Yup.string().oneOf(validacionColores, 'Seleccione una opción válida para el color del auto').required('Seleccione un color'),
    });

    const cargarInfoAuto = async (externalId) => {
        try {
            const token = getToken();
            const response = await obtenerTodo(`gerente/obtener/autos/${externalId}`, token);
            const autoData = response.data;
            console.log(response.data);
            setValue('total', autoData.precio);
            setAutoSeleccionado(autoData);
            setShowModal(true);
        } catch (error) {
            console.error('Error al cargar la información del auto:', error);
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, setValue, watch, handleSubmit, formState } = useForm(formOptions);
    const router = useRouter();
    const { errors } = formState;


    const onSubmit = (data) => {
        console.log("entro aqui");
        const externalUsuario = getExternalUser();

        if (!externalUsuario) {
            console.error("No se pudo obtener el external del usuario desde el sessionStorage");
            return;
        }

        const newData = {
            "fecha": data.fecha, //xxxx-xx-xx
            "descripcion": data.descripcion,
            "total": data.total,
            "cliente": data.cliente,
            "cedula": data.cedula,
            "persona": externalUsuario,
            "auto": data.auto,
        };
        console.log(newData);
        const token = getToken();

        enviar('agente/guardar/ventas', newData, token).then((info) => {
            if (info === '') {
                mensajes("Error en inicio de sesion", info.msg, "error");
            } else {
                console.log(info);
                mensajes("Buen trabajo!","success", "REGISTRADO CON ÉXITO");
                router.push('/principalAgente');
            }
        });
    };

    useEffect(() => {
        const updateTotalBasedOnColor = () => {
            let costoColorAdicional = 0;
            const color = watch('color');

            if (color === 'Azul (250$ adicional)') {
                costoColorAdicional = 250;
            } else if (color === 'Rojo (300$ adicional)') {
                costoColorAdicional = 300;
            }

            setValue('total', autoSeleccionado ? autoSeleccionado.precio + costoColorAdicional : '');
        };

        updateTotalBasedOnColor();
    }, [watch('color')]);

    return (
        <div className="container" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', autoginTop: '50px' }}>
            <h2 className="text-center">Registrar Venta</h2>
            <div className="wrapper">
                <div className="d-flex flex-column">
                    <div className="content">
                        <div className='container-fluid'>
                            <form className="user" style={{ autoginTop: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <div className="col-lg-6 mb-4">
                                        <div className="form-outline">
                                            <label className="form-label" style={{ marginRight: "2em" }}>Fecha</label>
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => {
                                                    const formattedDate = formatDate(date);
                                                    setValue('fecha', formattedDate);
                                                    setSelectedDate(date);
                                                }}
                                                dateFormat="dd/MM/yyyy"
                                                className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
                                            />
                                            <div className='alert alert-danger invalid-feedback'>{errors.fecha?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Descripcion</label>
                                            <input {...register('descripcion')} name="descripcion" id="descripcion" className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.descripcion?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Cedula Cliente</label>
                                            <input {...register('cedula')} name="cedula" id="cedula" className={`form-control ${errors.cedula ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.cedula?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Nombre Cliente</label>
                                            <input {...register('cliente')} name="cliente" id="cliente" className={`form-control ${errors.cliente ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.cliente?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Total</label>
                                            <input {...register('total')} name="total" id="total" className={`form-control ${errors.total ? 'is-invalid' : ''}`} disabled />
                                            <div className='alert alert-danger invalid-feedback'>{errors.total?.message}</div>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Autos</label>
                                            <select className='form-control' {...register('auto', { required: true })} onChange={(e) => {
                                                setValue('auto', e.target.value);
                                                cargarInfoAuto(e.target.value);
                                            }}>
                                                <option value="">Elija un auto</option>
                                                {Array.isArray(autos) && autos.map((auto, i) => (
                                                    <option key={i} value={auto.external_id}>
                                                        {auto.matricula}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Color del Auto</label>
                                            <select {...register('color')} className={`form-control ${errors.color ? 'is-invalid' : ''}`}>
                                                <option value="">Elija un color</option>
                                                {validacionColores.map((color, i) => (
                                                    <option key={i} value={color}>
                                                        {color}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className='alert alert-danger invalid-feedback'>{errors.color?.message}</div>
                                        </div>

                                    </div>

                                </div>

                                {autoSeleccionado && (
                                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Información del Auto Seleccionado</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p>matrícula: {autoSeleccionado.matricula}</p>
                                            <p>marca: {autoSeleccionado.marca}</p>
                                            <p>fecha fabricacion: {autoSeleccionado.fecha_fabricacion}</p>
                                            <p>recorrido: {autoSeleccionado.recorrido}</p>
                                            <p>precio: {autoSeleccionado.precio}</p>
                                            <h3>Imágenes del Auto</h3>
                                            {autoSeleccionado.imagen && autoSeleccionado.imagen.length === 0 ? (
                                                <p>No hay imágenes disponibles para este auto.</p>
                                            ) : (
                                                <div className="rounded-container">
                                                    {autoSeleccionado.imagen && autoSeleccionado.imagen.map((imagen, index) => (
                                                        <img
                                                            key={index}
                                                            src={`http://localhost:3000/multimedia/${imagen.nombre}`}
                                                            alt={`Imagen ${index + 1}`}
                                                            className="img-thumbnail rounded m-2"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                                Cerrar
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                )}
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div style={{ display: 'flex', gap: '10px', autoginTop: '30px' }}>
                                            <a href="/principalAgente" className="btn btn-danger btn-rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" descripcion="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                                                </svg>
                                                <span style={{ autoginLeft: '5px' }}>Cancelar</span>
                                            </a>
                                            <input className="btn btn-success btn-rounded" type='submit' value='Registrar'></input>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}