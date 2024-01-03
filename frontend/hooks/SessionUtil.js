
export const save = (key, data) => {
    sessionStorage.setItem(key, data);
};

export const get = (key) => {
    return sessionStorage.getItem(key);
};

export const saveToken = (key) => {
    return sessionStorage.setItem("token", key);
};

export const getToken = () => {
    return sessionStorage.getItem("token");
};

export const borrarSesion = () => {
    sessionStorage.clear();
};

export const saveExternalUser = (externalUser) => {
  sessionStorage.setItem("externalUser", externalUser);
};

export const getExternalUser = () => {
  var sesion=sessionStorage.getItem('externalUser')
  return sesion;
};

export const getRolUsuario = () => {
  var sesion=sessionStorage.getItem('rol')
  return sesion;
};


export const estaSesion = () => {
  try {
    if (typeof window !== 'undefined') {
      var token = sessionStorage.getItem('token');
      console.log('Valor del token:', token);
      return token && token !== 'undefined' && token !== null && token !== 'null';
    }
  } catch (error) {
    console.error('Error al verificar la sesión:', error);
  }
  return false;
};