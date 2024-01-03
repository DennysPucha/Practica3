"use client";
import MenuAdmin from "@/componentes/menuAdmin";
import { obtenerTodo } from "@/hooks/Conexion";
import Link from "next/link";
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { useEffect, useState } from "react";
export default function Principal() {
  const [ventas, setVentas] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const externalUser = getExternalUser();

      if (token) {
        try {
          const response = await obtenerTodo(`agente/obtener/ventas/${externalUser}`, token);
          setVentas(response.data.ventas);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchData();
  }, []);

  const filtrarVentas = () => {
    if (!mesSeleccionado && !cedulaBusqueda) {
      return ventas;
    }

    return ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      const mesVenta = fechaVenta.getMonth() + 1;
      const cumpleFiltroMes = !mesSeleccionado || mesVenta === mesSeleccionado;
      const cumpleFiltroCedula = !cedulaBusqueda || venta.cedula.includes(cedulaBusqueda);

      return cumpleFiltroMes && cumpleFiltroCedula;
    });
  };

  return (
    <div>
      <div>
        <MenuAdmin />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingLeft: "10px" }}>
        <h1 style={{ margin: 0 }}>Listado de Ventas</h1>
        <Link href="/nuevo" passHref>
          <button className="btn btn-primary">Añadir Venta</button>
        </Link>
      </div>
      <div>
        <label>Seleccionar Mes:</label>
        <select className="form-select" onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}>
          <option value={null}>Todos los meses</option>
          <option value={1}>Enero</option>
          <option value={2}>Febrero</option>
          <option value={3}>Marzo</option>
          <option value={4}>Abril</option>
          <option value={5}>Mayo</option>
          <option value={6}>Junio</option>
          <option value={7}>Julio</option>
          <option value={8}>Agosto</option>
          <option value={9}>Septiembre</option>
          <option value={10}>Octubre</option>
          <option value={11}>Noviembre</option>
          <option value={12}>Diciembre</option>
        </select>
      </div>
      <div className="mb-3">
        <label>Buscador de Ventas por Cédula:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por cédula"
          value={cedulaBusqueda}
          onChange={(e) => setCedulaBusqueda(e.target.value)}
        />
      </div>
      {Array.isArray(ventas) && ventas.length > 0 ? (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Nro</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Cédula</th>
                <th>Descripción</th>
                <th>Total</th>
                <th>Matricula</th>
                <th>Marca</th>
                <th>Editar</th>
              </tr>
            </thead>
            <tbody>
              {filtrarVentas().map((venta, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{venta.fecha}</td>
                  <td>{venta.cliente}</td>
                  <td>{venta.cedula}</td>
                  <td>{venta.descripcion}</td>
                  <td>{venta.total}</td>
                  <td>{venta.auto.matricula}</td>
                  <td>{venta.auto.marca}</td>
                  <td>
                    {venta.external_id && (
                      <Link href={`editar/${venta.external_id}`} passHref>
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
        <p>No se encontraron ventas.</p>
      )}
    </div>
  );
}