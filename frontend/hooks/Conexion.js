let URL = "http://localhost:3000/back/";



export function url_api() {
  return URL;
}

export function obtener(recurso) {
  return fetch(URL + recurso)
    .then(response => response.json());
}

export async function obtenerTodo(recurso, token) {
  const headers = {
    Accept: "application/json",
    "content-type": "application/json",
    "token-autos": token,
  };

  const response = await fetch(URL + recurso, {
    method: "GET",
    headers: headers,
    cache: 'no-store',
  });
  return await response.json();
}


export async function enviar(recurso, data,token) {
  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "token-autos": token,
  };
  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function enviarArchivos(recurso, formData, token) {
  const headers = {
    "token-autos": token,
  };

  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: formData,
  });

  return await response.json();
}
