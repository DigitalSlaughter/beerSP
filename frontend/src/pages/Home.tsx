import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DegustacionModal from "./Degustaciones";
import axios from "axios";

interface UsuarioResumen {
  id?: number;
  nombre_usuario: string;
  foto?: string; // URL firmada generada por el backend
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
  fecha: string;
}

interface DegustacionUsuario {
  id: number;
  cerveza: {
    id: number;
    nombre_cerveza: string;
  };
  local: {
    id: number;
    nombre_local: string;
  };
  puntuacion: number;
  comentario: string;
  fecha: string;
}

const Home: React.FC = () => {
  const [usuarioResumen, setUsuarioResumen] = useState<UsuarioResumen | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [cervezasFavoritas, setCervezasFavoritas] = useState<CervezaFavorita[]>([]);
  const [galardones, setGalardones] = useState<Galardon[]>([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [degustacionesUsuario, setDegustacionesUsuario] = useState<DegustacionUsuario[]>([]);
  const [modalDegustacionesOpen, setModalDegustacionesOpen] = useState(false);

  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        const usuarioId = decoded.id;

        const [resUsuario] = await Promise.all([
          axios.get(`http://localhost:4000/api/usuarios/${usuarioId}`, { withCredentials: true })
        ]);
        
         // const [resUsuario, resActividades, resCervezas, resGalardones] = await Promise.all([
          //axios.get(`http://localhost:4000/api/usuarios/${usuarioId}`, { withCredentials: true }),
          //axios.get("http://localhost:4000/api/actividades/recientes", { withCredentials: true }).catch(() => ({ data: [] })),
          //axios.get("http://localhost:4000/api/cervezas/favoritas", { withCredentials: true }).catch(() => ({ data: [] })),
          //axios.get("http://localhost:4000/api/galardones", { withCredentials: true }).catch(() => ({ data: [] })),
        //]);

        if (resUsuario?.data) setUsuarioResumen(resUsuario.data);
        //if (resActividades?.data) setActividades(resActividades.data);
        //if (resCervezas?.data) setCervezasFavoritas(resCervezas.data);
        //if (resGalardones?.data) setGalardones(resGalardones.data);
      } catch (err) {
        console.error("Error cargando datos inicio:", err);
        setError("No se pudo cargar la información de inicio.");
      }
    };

    fetchDatos();
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a BeerSp</h1>
        {error && <p className="text-red-500">{error}</p>}

        {/* Panel de perfil */}
        <div className="bg-white rounded shadow p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {usuarioResumen?.foto ? (
              <img
                src={usuarioResumen.foto}
                alt="Foto de perfil"
                className="w-16 h-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                onClick={() => setImagenAmpliada(usuarioResumen.foto ?? null)} // 🔥 NUEVO
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">?</div>
            )}

            <div>
              <p className="font-bold">{usuarioResumen?.nombre_usuario || "Usuario"}</p>
              <p>Degustaciones: {usuarioResumen?.numDegustaciones ?? 0}</p>
              <p>Locales nuevos (7 días): {usuarioResumen?.numLocalesNuevos ?? 0}</p>

              {usuarioResumen?.solicitudesPendientes ? (
                <p className="text-blue-600">
                  Solicitudes pendientes: {usuarioResumen.solicitudesPendientes}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
            >
              Hacer degustación
            </button>

            <button
              onClick={handleVerDegustaciones}
              className="bg-gray-100 text-gray-800 px-3 py-2 rounded hover:bg-gray-200"
            >
              Ver todas las degustaciones
            </button>
          </div>
        </div>

        {/* Actividades */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-bold mb-2">Actividades recientes de tus amigos</h2>
          {actividades.length > 0 ? (
            <ul className="space-y-1">
              {actividades.slice(0, 5).map((act) => (
                <li key={act.id}>
                  <span className="font-semibold">{act.usuario}</span>: {act.descripcion} ({act.fecha})
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay actividades recientes.</p>
          )}
        </div>

        {/* Cervezas favoritas */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-bold mb-2">Tus cervezas favoritas</h2>
          {cervezasFavoritas.length > 0 ? (
            <ul className="space-y-1">
              {cervezasFavoritas.slice(0, 3).map((c) => (
                <li key={c.id}>{c.nombre} - Puntuación: {c.puntuacion}</li>
              ))}
            </ul>
          ) : (
            <p>No tienes cervezas favoritas aún.</p>
          )}
        </div>

        {/* Galardones */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="font-bold mb-2">Tus últimos galardones</h2>
          {galardones.length > 0 ? (
            <ul className="space-y-1">
              {galardones.slice(0, 5).map((g) => (
                <li key={g.id}>{g.nombre} ({g.fecha})</li>
              ))}
            </ul>
          ) : (
            <p>No tienes galardones aún.</p>
          )}
        </div>

        {/* Modal degustación */}
        {modalOpen && (
          <DegustacionModal
            onClose={() => setModalOpen(false)}
            onSuccess={() => {
              setModalOpen(false);
              setTimeout(() => window.location.reload(), 300);
            }}
          />
        )}

        {/* Modal degustaciones usuario */}
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
                      <p>Local: {d.local.nombre_local}</p>
                      <p>Puntuación: {d.puntuacion}</p>
                      <p>Comentario: {d.comentario}</p>
                      <p>Fecha: {d.fecha}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tienes degustaciones registradas.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* 🔥 MODAL DE IMAGEN AMPLIADA */}
      {imagenAmpliada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={imagenAmpliada}
            alt="Imagen ampliada"
            className="max-w-full max-h-full rounded-xl shadow-xl"
          />
        </div>
      )}
    </div>
  );
};

export default Home;
