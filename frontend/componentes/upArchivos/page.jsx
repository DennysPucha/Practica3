"use client";
// Importa las funciones necesarias
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import mensajes from '@/componentes/mensajes';
import { getExternalUser, getToken } from '@/hooks/SessionUtil';
import { enviarArchivos } from '@/hooks/Conexion';
import { estaSesion } from '@/hooks/SessionUtil';
import { useRouter } from 'next/navigation'
// Función para crear objetos personalizados de archivos
const createFileObject = (file) => {
  // Crea un nuevo objeto File con todas las propiedades del archivo original
  const newFile = new File([file], file.name, {
    lastModified: file.lastModified,
    type: file.type,
  });

  // Agrega la propiedad preview al nuevo objeto File
  newFile.preview = URL.createObjectURL(newFile);

  return newFile;
};

const Upload = ({ external }) => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.slice(0, 3 - files.length);

    setFiles((prevFiles) => [
      ...prevFiles,
      ...newFiles.map(createFileObject),
    ]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/png, image/jpg',
    multiple: true,
    maxFiles: 3,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      mensajes('Debe subir al menos un archivo', 'error', 'Error');
      return;
    }

    console.log('Archivos a enviar:', files);

    const token = getToken();
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`Archivo${index + 1}`, file, file.name);
    });
    console.log(external);
    if (estaSesion()) {
      console.log(formData);
      const resultado = await enviarArchivos(`gerente/guardar/ImageAuto/${external}`, formData, token);

      console.log(resultado);
      mensajes('Imagenes del auto subidas con éxito', 'success', 'Operación exitosa');
      router.push('/principalGerente');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Subir Archivos para el Auto</h1>
      <form onSubmit={handleSubmit}>
        <div {...getRootProps()} className={`dropzone text-center ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <p>Suelte aquí las imágenes para el auto (máx. 3 archivos)</p>
        </div>
        <div className="d-flex justify-content-center mt-4">
          {files.map((file, index) => (
            <div key={index} className="text-center mr-3">
              <img src={file.preview} alt={file.name} className="img-thumbnail mb-2" />
              <p>{file.name}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary">
            Guardar Imágenes
          </button>
        </div>
      </form>

      <style jsx global>{`
        .dropzone {
          border: 2px dashed #cccccc;
          border-radius: 4px;
          padding: 20px;
          cursor: pointer;
        }

        .dropzone.active {
          border-color: #2196f3;
        }
      `}</style>
    </div>
  );
};


export default Upload;