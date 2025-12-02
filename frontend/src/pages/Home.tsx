import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import DegustacionModal from "./Degustaciones";
import axios from "axios";

// ─────────────────────────────────────────────────────────────
// Tipados del Home
// ─────────────────────────────────────────────────────────────

interface UsuarioResumen {
  id?: number;
  nombre_usuario: string;
  foto?: string;
  numDegustaciones?: number;
  numLocalesNuevos?: number;
  solicitudesPendientes?: number;
}

interface Actividad {
  id: number;
  usuario: string;
  descripcion: string;
  fecha: string;
}

interface CervezaFavorita {
  id: number;
  nombre: string;
  puntuacion: number;
}

interface Galardon {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  nivelCalculado: number;
  nivelAlmacenado: number;
  completado: boolean;
  faltante: number;
  siguienteRequisito: number | null;
}


interface DegustacionUsuario {
  id: number;
  cerveza: { id: number; nombre_cerveza: string };
  local: { id: number; nombre_local: string };
  puntuacion: number;
  fecha: string;
  comentarios?: {
    id: number;
    texto: string;
    usuario: { nombre_usuario: string };
    fecha: string;
  }[];
}

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────

const Home: React.FC = () => {
  const [usuarioResumen, setUsuarioResumen] = useState<UsuarioResumen | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cervezasFavoritas, setCervezasFavoritas] = useState<CervezaFavorita[]>([]);
  const [galardones, setGalardones] = useState<Galardon[]>([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDegustacionesOpen, setModalDegustacionesOpen] = useState(false);
  const [degustacionesUsuario, setDegustacionesUsuario] = useState<DegustacionUsuario[]>([]);
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  const placeholderImg =
    "https://placehold.co/128x128/EBF4FF/7F9CF5?text=User";

  // ─────────────────────────────────────────────────────────────
  // Carga inicial del Home
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        const usuarioId = decoded.id;

        // Datos del usuario
        const resUsuario = await axios.get(
          `http://localhost:4000/api/usuarios/${usuarioId}`,
          { withCredentials: true }
        );

        if (resUsuario?.data) setUsuarioResumen(resUsuario.data);

        /*// Actividades
        const resActividades = await axios.get(
          `http://localhost:4000/api/usuarios/${usuarioId}/amigos/actividades`,
          { withCredentials: true }
        );
        setActividades(resActividades.data.slice(0, 5));

        // Cervezas favoritas
        const resFavoritas = await axios.get(
          `http://localhost:4000/api/usuarios/${usuarioId}/favoritas`,
          { withCredentials: true }
        );
        setCervezasFavoritas(resFavoritas.data);*/

        // Galardones
        const resGalardones = await axios.get(
          `http://localhost:4000/api/usuarios/${usuarioId}/galardones`,
          { withCredentials: true }
        );
        setGalardones(resGalardones.data);

      } catch (err) {
        console.error("Error cargando datos inicio:", err);
        setError("No se pudo cargar la información de inicio.");
      }
    };

    fetchDatos();
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Abrir modal de degustaciones del usuario
  // ─────────────────────────────────────────────────────────────

  const handleVerDegustaciones = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("No estás autenticado");

      const decoded: any = JSON.parse(atob(token.split(".")[1]));
      const usuarioId = decoded.id;

      const res = await axios.get(
        `http://localhost:4000/api/usuarios/${usuarioId}/degustaciones`,
        { withCredentials: true }
      );

      setDegustacionesUsuario(res.data);
      setModalDegustacionesOpen(true);
    } catch (err) {
      console.error("Error al cargar degustaciones:", err);
      alert("No se pudieron cargar las degustaciones.");
    }
  };

  // ─────────────────────────────────────────────────────────────

  return (
    <MainLayout>
      <div className="flex-1 max-w-7xl mx-auto w-full mt-6 px-4 md:px-6">

        <h1 className="text-3xl font-bold mb-2">Bienvenido a BeerSp</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ────────────────────────────────────────────────────────
             PANEL DE PERFIL
          ───────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-lg shadow p-4 md:col-span-1">
            <div className="flex items-center gap-4">
              <img
                src={usuarioResumen?.foto || placeholderImg}
                alt="perfil"
                className="w-16 h-16 rounded-full object-cover cursor-pointer"
                onClick={() => setImagenAmpliada(usuarioResumen?.foto ?? null)}
              />
              <div>
                <div className="font-bold text-lg">
                  {usuarioResumen?.nombre_usuario || "Usuario"}
                </div>

                <div className="text-sm text-gray-600">
                  Degustaciones:
                  <span className="font-medium"> {usuarioResumen?.numDegustaciones ?? 0}</span>
                </div>

                <div className="text-sm text-gray-600">
                  Locales nuevos (7d):
                  <span className="font-medium"> {usuarioResumen?.numLocalesNuevos ?? 0}</span>
                </div>

                {usuarioResumen?.solicitudesPendientes && (
                  <div className="mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block">
                    Solicitudes: {usuarioResumen.solicitudesPendientes}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setModalOpen(true)}
                className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded hover:bg-yellow-500"
              >
                Hacer degustación
              </button>

              <button
                onClick={handleVerDegustaciones}
                className="flex-1 bg-gray-100 text-gray-800 px-3 py-2 rounded hover:bg-gray-200"
              >
                Ver degustaciones
              </button>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div className="font-medium mb-1">Accesos rápidos</div>
              <div className="flex flex-col gap-2">
                <Link to="/degustaciones" className="text-blue-600 hover:underline">
                  ▷ Degustaciones más valoradas
                </Link>
                <Link to="/galardones" className="text-blue-600 hover:underline">
                  ▷ Mis galardones
                </Link>
                <Link to="/profile" className="text-blue-600 hover:underline">
                  ▷ Ver perfil completo
                </Link>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────
             COLUMNA DERECHA
          ───────────────────────────────────────────────────────── */}
          <div className="md:col-span-2 space-y-6">

            {/* ACTIVIDADES DE AMIGOS */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold text-lg">Actividades recientes de tus amigos</h2>

              <div className="mt-3">
                {actividades.length > 0 ? (
                  <ul className="space-y-2">
                    {actividades.map(act => (
                      <li key={act.id} className="text-sm">
                        <span className="font-semibold">{act.usuario}</span>: {act.descripcion}
                        <span className="text-xs text-gray-400"> ({act.fecha})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hay actividades recientes.</p>
                )}
              </div>

              <div className="mt-3">
                <Link to="/actividades" className="text-blue-600 hover:underline text-sm">
                  Ver todas las actividades
                </Link>
              </div>
            </div>

            {/* FAVORITOS Y GALARDONES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* CERBEZAS FAVORITAS */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold">Tus cervezas favoritas</h3>

                <div className="mt-3">
                  {cervezasFavoritas.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {cervezasFavoritas.slice(0, 3).map(c => (
                        <li key={c.id}>
                          {c.nombre}
                          <span className="text-xs text-gray-500">
                            {" "}– Puntuación: {c.puntuacion}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No tienes cervezas favoritas aún.</p>
                  )}
                </div>

                <div className="mt-3">
                  <Link to="/favoritas" className="text-blue-600 hover:underline text-sm">
                    Ver lista completa
                  </Link>
                </div>
              </div>

              {/* GALARDONES */}
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="font-semibold text-lg mb-2">Tus galardones completados</h3>

                <div className="space-y-4">
                  {galardones.filter(g => g.completado).length > 0 ? (
                    galardones
                      .filter(g => g.completado)
                      .slice(0, 5) // limitar a los 5 más recientes
                      .map((g) => {
                        const progreso = 100; // siempre completado

                        return (
                          <div
                            key={g.id}
                            className="p-4 rounded-xl border shadow-sm bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-md transition cursor-pointer"
                          >
                            {/* HEADER */}
                            <div className="flex items-center gap-3 mb-2">
                              {/* ICONO */}
                              <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center shadow-inner border border-yellow-500">
                                <span className="text-2xl">🏅</span>
                              </div>

                              <div>
                                <div className="font-semibold text-md">{g.nombre}</div>
                                <div className="text-xs text-gray-500">
                                  Obtenido: {g.fecha}
                                </div>
                              </div>

                              <span className="ml-auto px-2 py-1 text-xs rounded-full font-semibold bg-green-200 text-green-700">
                                Completado
                              </span>
                            </div>

                            {/* DESCRIPCIÓN */}
                            {g.descripcion && <p className="text-sm text-gray-700 mb-3">{g.descripcion}</p>}

                            {/* BARRA DE PROGRESO */}
                            <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 transition-all duration-700"
                                style={{ width: `${progreso}%` }}
                              ></div>
                            </div>

                            <div className="text-xs text-gray-600 mt-1">¡Galardón completado!</div>
                          </div>
                        );
                      })
                  ) : (
                    <p className="text-sm text-gray-500">No tienes galardones completados aún.</p>
                  )}
                </div>

                <div className="mt-3">
                  <Link to="/galardones" className="text-blue-600 hover:underline text-sm">
                    Ver todos los galardones
                  </Link>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────
           MODAL DEGUSTACIONES
        ───────────────────────────────────────────────────────── */}
        {modalDegustacionesOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
            <div className="bg-white w-full max-w-2xl rounded shadow p-4 relative">
              <h2 className="text-xl font-bold mb-4">Tus degustaciones</h2>

              <button
                onClick={() => setModalDegustacionesOpen(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                ✖
              </button>

              {degustacionesUsuario.length > 0 ? (
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {degustacionesUsuario.map(d => (
                    <li key={d.id} className="border p-2 rounded">
                      <p className="font-semibold">{d.cerveza.nombre_cerveza}</p>
                      <p className="text-sm">Local: {d.local.nombre_local}</p>
                      <p className="text-sm">Puntuación: {d.puntuacion}</p>
                      <p className="text-xs text-gray-400">Fecha: {d.fecha}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tienes degustaciones registradas.</p>
              )}
            </div>
          </div>
        )}

        {/* IMAGEN AMPLIADA */}
        {imagenAmpliada && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={() => setImagenAmpliada(null)}
          >
            <img
              src={imagenAmpliada}
              alt="Imagen ampliada"
              className="max-w-full max-h-full rounded-xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* MODAL REGISTRAR DEGUSTACIÓN */}
        {modalOpen && (
          <DegustacionModal
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              setTimeout(() => window.location.reload(), 300);
            }}
          />
        )}

      </div>
    </MainLayout>
  );
};

export default Home;
