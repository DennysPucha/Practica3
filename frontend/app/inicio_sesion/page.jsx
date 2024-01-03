"use client";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { inicio_sesion } from '@/hooks/Autenticacion';
import { estaSesion, getExternalUser, getRolUsuario } from '@/hooks/SessionUtil';
import mensajes from '@/componentes/mensajes';
import { useRouter } from 'next/navigation'
import Menu from '@/componentes/menu';


export default function Inicio_sesion() {
    const router = useRouter();
    const validationSchema = Yup.object().shape({
        usuario: Yup.string().required('Ingrese el usuario'),
        clave: Yup.string().required('Ingrese su clave'),
    });
    
    const formOptions = { resolver: yupResolver(validationSchema) };
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;


    const sendData = (data) => {
        var data = { 
            "usuario": data.usuario, 
            "clave": data.clave 
        };
        inicio_sesion(data).then((info) => {
        
            if (estaSesion()) {
                mensajes("Has ingresado al sistema!", "success", "Bienvenido");
                const user=getRolUsuario();
                if(user=="Agente"){
                    router.push("/principalAgente");
                }else if (user=="Gerente"){
                    router.push("/principalGerente");
                }else{
                    mensajes("El rol no tiene asignado ninguna pagina", "error", "Verifique su rol de usuario");
                }
            } else {
                mensajes("Error al iniciar sesión!", "error", "algo malio sal");
            }
        });
    };
    return (
        <div className="container">
            <header>
                <Menu />
            </header>
            <section className="vh-100">
                <div className="container py-5 h-100">
                    <div className="row d-flex align-items-center justify-content-center h-100">
                        <div className="col-md-8 col-lg-7 col-xl-6">
                            <img
                                src="https://cdn2.tfx.company/images/clickwallpapers-DodgeChallenger-carros-4k-img1.jpg"
                                className="img-fluid rounded shadow-lg"
                                alt="Phone image"
                                style={{ maxWidth: '100%', height: 'auto' }}
                            />
                        </div>
                        <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                            <h1>Inicio de sesión</h1>
                            <form onSubmit={handleSubmit(sendData)} >

                                <div className="form-outline mb-4">
                                    <input{...register('usuario')} id="usuario" className={`form-control form-control-lg ${errors.usuario ? 'is-invalid' : ''}`} />
                                    <label className="form-label" htmlFor="usuario">usuario</label>
                                    <div style={{ display: errors.usuario ? 'block' : 'none' }} className="alert alert-danger invalid-feedback">
                                        {errors.usuario?.message}
                                    </div>
                                </div>

                                <div className="form-outline mb-4">
                                    <input {...register('clave')} type="password" id="clave" className="form-control form-control-lg" />
                                    <label className="form-label" htmlFor="form1Example23">Contraseña</label>
                                    <div style={{ display: errors.clave ? 'block' : 'none' }} className="alert alert-danger invalid-feedback">
                                        {errors.clave?.message}
                                    </div>
                                </div>
                                    
                                <button type="submit" className="btn btn-primary btn-lg btn-block">Acceder</button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
