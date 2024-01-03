"use client";
import Link from "next/link";
import { borrarSesion } from "@/hooks/SessionUtil";
import { useEffect, useRef } from "react";

export default function MenuAdmin() {
  const cerrarSesionRef = useRef();

  useEffect(() => {
    const cerrarSesion = () => {
      borrarSesion();
      window.location.href = "/";
    };

    cerrarSesionRef.current = cerrarSesion;

    const enlaceCerrarSesion = document.getElementById('enlaceCerrarSesion');
    if (enlaceCerrarSesion) {
      enlaceCerrarSesion.addEventListener('click', cerrarSesionRef.current);
    }

    return () => {
      if (enlaceCerrarSesion) {
        enlaceCerrarSesion.removeEventListener('click', cerrarSesionRef.current);
      }
    };
  }, []); 

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <>
                <li className="nav-item">
                  <a className="nav-link" id="enlaceCerrarSesion" style={{ cursor: 'pointer' }}>Cerrar Sesión</a>
                </li>
              </>
          </ul>
        </div>
      </div>
    </nav>
  );
}
