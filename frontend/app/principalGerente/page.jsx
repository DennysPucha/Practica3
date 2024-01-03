"use client";
import MenuAdmin from "@/componentes/menuAdmin";
import { obtenerTodo } from "@/hooks/Conexion";
import Link from "next/link";
import { getToken,getExternalUser } from "@/hooks/SessionUtil";
import { useEffect,useState } from "react";
export default function Principal() {
  const [autos, setAutos] = useState([]);
  const [matriculaBusqueda, setMatriculaBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const externalUser = getExternalUser();

      if (token) {
        try {
          const response = await obtenerTodo(`gerente/listar/autos`, token);
          setAutos(response.data);
          console.log(response);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, []);

  const filtrarAutosPorMatricula = () => {
    if (!matriculaBusqueda) {
      return autos;
    }

    return autos.filter((auto) => auto.matricula.includes(matriculaBusqueda));
  };

  return (
    <div>
      <div>
        <MenuAdmin />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "10px" }}>
        <h1 style={{ margin: 0 }}>Listado de autos</h1>
        <Link href="/newAuto" passHref>
          <button className="btn btn-primary">Añadir auto</button>
        </Link>
      </div>
      <div className="mb-3">
        <label>Buscar por Matrícula:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Ingrese la matrícula"
          value={matriculaBusqueda}
          onChange={(e) => setMatriculaBusqueda(e.target.value)}
        />
      </div>
      {Array.isArray(autos) && autos.length > 0 ? (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Nro</th>
                <th>Matricula</th>
                <th>Marca</th>
                <th>Color</th>
                <th>Fecha_fabricacion</th>
                <th>Recorrido</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {filtrarAutosPorMatricula().map((auto, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{auto.matricula}</td>
                  <td>{auto.marca}</td>
                  <td>{auto.color}</td>
                  <td>{auto.fecha_fabricacion}</td>
                  <td>{auto.recorrido + "km"}</td>
                  <td>{auto.precio}</td>
                  <td>{auto.estado ? "Vendido" : "No vendido"}</td>
                  <td>
                    {auto.external_id && (
                      <Link href={`editAuto/${auto.external_id}`} passHref>
                        <button className="btn btn-success">Editar</button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No se encontraron autos.</p>
      )}
    </div>
  );
}