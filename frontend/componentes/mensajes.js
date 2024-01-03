import swal from 'sweetalert';

const mensajes = (texto, tipo = 'success', titulo = 'Título predeterminado') => {
    swal(titulo, texto, tipo, {
        button: 'Aceptar',
        timer: 3000,
        closeOnEsc: true,
    });
};

export default mensajes;