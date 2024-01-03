import { enviar } from "./Conexion";
import {save,saveToken} from "./SessionUtil"

export async function inicio_sesion(data) {
    const sesion = await enviar('iniciar_sesion', data);
    if (sesion && sesion.code === 200 && sesion.data.token) {
      saveToken(sesion.data.token);
      save('usuario', sesion.data.usuario);
      save('externalUser', sesion.data.external_id);
      save('rol', sesion.data.rol);
    }
  
    return sesion;
  }
