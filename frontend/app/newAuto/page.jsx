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
    const [selectedDate, setSelectedDate] = useState(null);
    const validacionColores = ['Plata', 'Blanco', 'Azul', 'Rojo'];
    const validationSchema = Yup.object().shape({
        fecha_fabricacion: Yup.string().required('Ingrese una fecha_fabricacion'),
        matricula: Yup.string().required('Ingrese el matricula'),
        marca: Yup.string().required('Ingrese la marca'),
        matricula: Yup.string().required('Ingrese la matricula'),
        recorrido: Yup.number().positive().required('Ingrese el recorrido'),
        precio: Yup.number().positive().required('Ingrese el precio'),
        color:Yup.string().oneOf(validacionColores, 'Seleccione una opción válida para el color del auto').required('Seleccione un color'),
    });


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
            "fecha_fabricacion": data.fecha_fabricacion, //xxxx-xx-xx
            "matricula": data.matricula,
            "marca": data.marca,
            "matricula": data.matricula,
            "recorrido": data.recorrido,
            "precio": data.precio,
            "color":data.color,
            "persona": externalUsuario,
        };
        console.log(newData);
        const token = getToken();
        

        enviar('gerente/guardar/autos', newData, token).then((info) => {
            if (info === '') {
                mensajes("Error en inicio de sesion", info.msg, "error");
            } else {
                console.log(info.external_id);
                const externalAuto=info.external_id;
                mensajes("Buen trabajo!", "success", "REGISTRADO CON ÉXITO");
                router.push(`/uploadFiles/${externalAuto}`);
            }
        });
    };

    return (
        <div className="container" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', autoginTop: '50px' }}>
            <h2 className="text-center">Registrar Auto</h2>
            <div className="wrapper">
                <div className="d-flex flex-column">
                    <div className="content">
                        <div className='container-fluid'>
                            <form className="user" style={{ autoginTop: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    <div className="col-lg-6 mb-4">
                                        <div className="form-outline">
                                            <label className="form-label" style={{ marginRight: "2em" }}>fecha_fabricacion</label>
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => {
                                                    const formattedDate = formatDate(date);
                                                    setValue('fecha_fabricacion', formattedDate);
                                                    setSelectedDate(date);
                                                }}
                                                dateFormat="dd/MM/yyyy"
                                                className={`form-control ${errors.fecha_fabricacion ? 'is-invalid' : ''}`}
                                            />
                                            <div className='alert alert-danger invalid-feedback'>{errors.fecha_fabricacion?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Matricula</label>
                                            <input {...register('matricula')} name="matricula" id="matricula" className={`form-control ${errors.matricula ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.matricula?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Marca</label>
                                            <input {...register('marca')} name="marca" id="marca" className={`form-control ${errors.marca ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.marca?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Color Base del Auto</label>
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

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Recorrido</label>
                                            <input {...register('recorrido')} name="recorrido" id="recorrido" className={`form-control ${errors.recorrido ? 'is-invalid' : ''}`}  />
                                            <div className='alert alert-danger invalid-feedback'>{errors.recorrido?.message}</div>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <label className="form-label">Precio</label>
                                            <input {...register('precio')} name="precio" id="precio" className={`form-control ${errors.precio ? 'is-invalid' : ''}`} />
                                            <div className='alert alert-danger invalid-feedback'>{errors.precio?.message}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-lg-12">
                                        <div style={{ display: 'flex', gap: '10px', autoginTop: '30px' }}>
                                            <a href="/principalGerente" className="btn btn-danger btn-rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" matricula="16" fill="currentmatricula" className="bi bi-x-circle" viewBox="0 0 16 16">
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