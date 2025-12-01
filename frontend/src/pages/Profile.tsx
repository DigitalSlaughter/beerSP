// src/pages/Profile.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import MainLayout from "../components/MainLayout";

interface Usuario {
  id: number;
  nombre_usuario: string;
  correo: string;
  nombre?: string;
  apellidos?: string;
  ubicacion?: string;
  genero?: string;
  pais?: string;
  fecha_nacimiento?: string;
  texto_introduccion?: string;
  foto?: string;
}

interface DecodedToken {
  id: number;
  nombre_usuario: string;
  correo: string;
  exp: number;
}

function decodeJWT(token: string): DecodedToken {
  const payload = token.split(".")[1];
  const decodedJson = atob(payload);
  return JSON.parse(decodedJson);
}

const Profile: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoOriginal, setFotoOriginal] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [fotoModal, setFotoModal] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setError("Usuario no autenticado.");

      try {
        const decoded: DecodedToken = decodeJWT(token);
        const response = await axios.get(
          `http://localhost:4000/api/usuarios/${decoded.id}`,
          { withCredentials: true }
        );
        setUsuario(response.data);
        setFotoOriginal(response.data.foto);
      } catch (err: any) {
        console.error("Error al obtener usuario:", err);
        setError("No se pudo cargar la información del usuario.");
      }
    };

    fetchUsuario();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (usuario) setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleClear = (campo: keyof Usuario) => {
    if (usuario) setUsuario({ ...usuario, [campo]: "" });
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    try {
      const formData = new FormData();
      formData.append("nombre_usuario", usuario.nombre_usuario);
      formData.append("correo", usuario.correo);

      const opcionales: (keyof Usuario)[] = [
        "nombre",
        "apellidos",
        "ubicacion",
        "genero",
        "pais",
        "fecha_nacimiento",
        "texto_introduccion",
      ];
      opcionales.forEach((campo) => {
        const valor = usuario[campo];
        formData.append(campo, valor !== undefined && valor !== null ? String(valor) : "");
      });

      if (foto) {
        formData.append("foto", foto);
      }

      const response = await axios.put(
        `http://localhost:4000/api/usuarios/${usuario.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true }
      );

      setInfo("Perfil actualizado correctamente.");
      setUsuario(response.data);
      setFoto(null);
      setFotoOriginal(response.data.foto);
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err);
      setError(err.response?.data?.error || "No se pudo actualizar el perfil.");
    }
  };

  if (!usuario) return <div>Cargando...</div>;

  const fotoUrl = foto
    ? URL.createObjectURL(foto)
    : usuario.foto
    ? usuario.foto
    : undefined;

  return (
    <MainLayout>
      <main className="flex-1 p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
        {error && <p className="text-red-500">{error}</p>}
        {info && <p className="text-green-500">{info}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Imagen de perfil arriba */}
          <div className="flex items-center gap-4 mb-4">
            {fotoUrl && (
              <img
                src={fotoUrl}
                alt="Perfil"
                className="w-32 h-32 object-cover rounded-full cursor-pointer hover:opacity-80 transition"
                onClick={() => setFotoModal(fotoUrl)}
              />
            )}
            <div className="flex flex-col gap-2">
              <label className="font-medium">Cambiar foto de perfil</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="border p-2 rounded"
              />
            </div>
          </div>

          {/* Resto del formulario */}
          <input
            type="text"
            name="nombre_usuario"
            placeholder="Nombre de usuario"
            value={usuario.nombre_usuario}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <div className="flex gap-2 items-center">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={usuario.nombre || ""}
              onChange={handleChange}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleClear("nombre")}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Borrar
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              value={usuario.apellidos || ""}
              onChange={handleChange}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleClear("apellidos")}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Borrar
            </button>
          </div>

          <input
            type="email"
            name="correo"
            placeholder="Correo"
            value={usuario.correo}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <div className="flex gap-2 items-center">
            <input
              type="text"
              name="ubicacion"
              placeholder="Ubicación"
              value={usuario.ubicacion || ""}
              onChange={handleChange}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleClear("ubicacion")}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Borrar
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              name="genero"
              placeholder="Género"
              value={usuario.genero || ""}
              onChange={handleChange}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleClear("genero")}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Borrar
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              name="pais"
              placeholder="País"
              value={usuario.pais || ""}
              onChange={handleChange}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleClear("pais")}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Borrar
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="date"
              name="fecha_nacimiento"
              value={usuario.fecha_nacimiento || ""}
              onChange={handleChange}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleClear("fecha_nacimiento")}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Borrar
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <textarea
              name="texto_introduccion"
              placeholder="Texto de introducción"
              value={usuario.texto_introduccion || ""}
              onChange={handleChange}
              className="border p-2 rounded flex-1"
            />
            <button
              type="button"
              onClick={() => handleClear("texto_introduccion")}
              className="px-2 py-1 bg-gray-300 rounded"
            >
              Borrar
            </button>
          </div>

          <button
            type="submit"
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
          >
            Guardar cambios
          </button>
        </form>

        {/* Modal de imagen */}
        {fotoModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setFotoModal(null)}
          >
            <img
              src={fotoModal}
              alt="Perfil ampliada"
              className="max-w-[90%] max-h-[90%] rounded"
            />
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default Profile;
