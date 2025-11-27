import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

interface Galardon {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  nivelCalculado: number;
  nivelAlmacenado: number;
  completado: boolean;
  faltante: number;
  siguienteRequisito: number | null;
}



const Galardones: React.FC = () => {
  const [galardones, setGalardones] = useState<Galardon[]>([]);
  const [error, setError] = useState("");
  const [verTodos, setVerTodos] = useState(false);
  const [galardonSeleccionado, setGalardonSeleccionado] = useState<Galardon | null>(null);

  useEffect(() => {
    const fetchGalardones = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        const usuarioId = decoded.id;

        const res = await axios.get(`http://localhost:4000/api/usuarios/${usuarioId}/galardones`);

        const galardonesData: Galardon[] = res.data.map((g: any) => ({
          id: g.id,
          nombre: g.nombre,
          descripcion: g.descripcion,
          fecha: g.fecha_obtencion ? new Date(g.fecha_obtencion).toLocaleDateString() : "",
          nivelCalculado: g.nivelCalculado,
          nivelAlmacenado: g.nivelAlmacenado,
          completado: g.completado,
          faltante: g.faltante,
          siguienteRequisito: g.siguienteRequisito
        }));

        setGalardones(galardonesData);
      } catch (err) {
        console.error("Error cargando galardones:", err);
        setError("No se pudieron cargar los galardones.");
      }
    };

    fetchGalardones();
  }, []);

  const galardonesObtenidos = galardones.filter(g => g.completado);
  const galardonesPendientes = galardones.filter(g => !g.completado);

  const mostrarTodos = verTodos ? galardones : galardones.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Mis Galardones</h1>

        {error && <p className="text-red-500">{error}</p>}

        {galardones.length > 0 ? (
          <>
            {/* Galardones obtenidos */}
            {galardonesObtenidos.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Obtenidos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {galardonesObtenidos.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setGalardonSeleccionado(g)}
                      className="bg-white rounded shadow p-4 flex flex-col items-center cursor-pointer hover:bg-yellow-50 transition"
                    >
                      <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center text-xl font-bold">
                        {g.nivelCalculado}
                      </div>
                      <p className="mt-2 font-semibold text-center">{g.nombre}</p>
                      {g.fecha && g.fecha !== "1/1/1970" && (
                        <p className="text-sm text-gray-500">{g.fecha}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Galardones pendientes */}
            {galardonesPendientes.length > 0 && (
              <div className="space-y-4 mt-6">
                <h2 className="text-2xl font-semibold">Pendientes</h2>
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ${!verTodos ? "max-h-64 overflow-y-auto pr-2" : ""}`}>
                  {galardonesPendientes.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setGalardonSeleccionado(g)}
                      className="bg-white rounded shadow p-4 flex flex-col items-center cursor-pointer opacity-50 hover:opacity-75 transition"
                    >
                      <div className="w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center text-xl font-bold">
                        {/* Nivel pendiente no se muestra */}
                      </div>
                      <p className="mt-2 font-semibold text-center">{g.nombre}</p>
                      {g.siguienteRequisito !== null && (
                        <p className="text-xs text-gray-400 mt-1 text-center">
                          Faltan {g.faltante} para el siguiente nivel
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {galardones.length > 3 && (
              <div className="flex justify-center">
                <button
                  onClick={() => setVerTodos(!verTodos)}
                  className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500"
                >
                  {verTodos ? "Ver menos" : "Ver todos"}
                </button>
              </div>
            )}
          </>
        ) : (
          <p>No tienes galardones aún.</p>
        )}
      </main>

      <Footer />

      {galardonSeleccionado && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setGalardonSeleccionado(null)}
        >
          <div
            className="bg-white rounded shadow p-6 max-w-sm w-full animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">{galardonSeleccionado.nombre}</h2>

            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-yellow-300 rounded-full flex items-center justify-center text-3xl font-bold">
                {galardonSeleccionado.nivelCalculado}
              </div>
            </div>

            <p className="text-gray-700 mb-2">{galardonSeleccionado.descripcion}</p>

            {/* Fecha de obtención si existe */}
            {galardonSeleccionado.fecha && (
              <p className="text-gray-700">
                <strong>Fecha obtención:</strong> {galardonSeleccionado.fecha}
              </p>
            )}

            {/* Mostrar nivel actual */}
            <p className="text-gray-700">
              <strong>Nivel actual:</strong> {galardonSeleccionado.nivelCalculado}
            </p>

            {/* Mostrar progreso hacia siguiente nivel si existe */}
            {galardonSeleccionado.siguienteRequisito !== null && (
              <p className="text-gray-700 mt-2">
                <strong>Progreso al siguiente nivel:</strong><br />
                Faltan <strong>{galardonSeleccionado.faltante}</strong> para llegar al requisito de&nbsp;
                <strong>{galardonSeleccionado.siguienteRequisito}</strong>.
              </p>
            )}

            <button
              onClick={() => setGalardonSeleccionado(null)}
              className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Galardones;
