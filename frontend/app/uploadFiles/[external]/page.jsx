
"use client";
import MenuAdminEdit from "@/componentes/menuAdminEdit";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'
import React from 'react';
import { getToken, getExternalUser } from "@/hooks/SessionUtil";
import { useState } from "react";
import { crearAuto, obtenerTodo } from "@/hooks/Conexion";
import { useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { enviar } from "@/hooks/Conexion";
import mensajes from "@/componentes/mensajes";
import Upload from "@/componentes/upArchivos/page";
export default function Page({ params }) {
    const{external}=params;
        return (
          <div>
            <Upload external={external} />
          </div>
        );

}