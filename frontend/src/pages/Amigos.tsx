import React, { useEffect, useState } from "react";
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

interface Solicitud {
  id: number;
  usuario1: Usuario;
  usuario2: Usuario;
  estado_solicitud: string;
}

function decodeJWT(token: string): DecodedToken {
  try {
    const payload = token.split(".")[1];
    const decodedJson = atob(payload);
    return JSON.parse(decodedJson);
  } catch (err) {
    console.error("Error decodificando token", err);
    return { id: 0, nombre_usuario: "", correo: "", exp: 0 };
  }
}

const Amigos: React.FC = () => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<Usuario[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [amigos, setAmigos] = useState<Usuario[]>([]);
  const [verTodosAmigos, setVerTodosAmigos] = useState(false);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState<Solicitud[]>([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState<Solicitud[]>([]);
  const [usuarioDetalle, setUsuarioDetalle] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const usuarioLogueadoId = token ? decodeJWT(token).id : null;

  const placeholderImg = "https://placehold.co/48x48?text=User";

  // Cache para fotos
  const fotoCache: Record<number, Usuario> = {};

  const fetchUsuarioConFoto = async (id: number): Promise<Usuario | null> => {
    if (fotoCache[id]) return fotoCache[id];
    try {
      const res = await axios.get(`http://localhost:4000/api/usuarios/${id}`);
      fotoCache[id] = res.data;
      return res.data;
    } catch (error) {
      console.error(`Error cargando usuario ${id}:`, error);
      return null;
    }
  };

  useEffect(() => {
    if (!usuarioLogueadoId) {
      setMensaje("No se ha podido identificar al usuario.");
      return;
    }
    fetchSolicitudes();
  }, [usuarioLogueadoId]);

  const fetchSolicitudes = async () => {
    if (!usuarioLogueadoId) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:4000/api/usuarios/${usuarioLogueadoId}/solicitudes`
      );
      const solicitudesArray: Solicitud[] = Array.isArray(res.data)
        ? res.data
        : res.data.solicitudes || [];

      const pendientesRecibidas = solicitudesArray.filter(
        (s) => s.estado_solicitud === "pendiente" && s.usuario2.id === usuarioLogueadoId
      );
      const pendientesEnviadas = solicitudesArray.filter(
        (s) => s.estado_solicitud === "pendiente" && s.usuario1.id === usuarioLogueadoId
      );

      setSolicitudesPendientes(pendientesRecibidas);
      setSolicitudesEnviadas(pendientesEnviadas);

      const aceptadas = solicitudesArray.filter((s) => s.estado_solicitud === "aceptada");
      const amigosFinal = aceptadas.map((s) =>
        s.usuario1.id === usuarioLogueadoId ? s.usuario2 : s.usuario1
      );

      // Ya vienen con foto directamente, solo actualizar cache por seguridad
      amigosFinal.forEach((a) => { if(a.foto) fotoCache[a.id] = a; });

      setAmigos(amigosFinal);
    } catch (error) {
      console.error(error);
      setMensaje("No se pudieron cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:4000/api/usuarios");
      const todosUsuarios: Usuario[] = Array.isArray(res.data) ? res.data : res.data.usuarios || [];
      const filtrados = todosUsuarios.filter(
        (u) =>
          (u.nombre_usuario.toLowerCase().includes(query.trim().toLowerCase()) ||
            u.correo.toLowerCase().includes(query.trim().toLowerCase())) &&
          u.id !== usuarioLogueadoId
      );

      setResultados(filtrados);
      setMensaje(filtrados.length === 0 ? "No se encontraron usuarios." : "");
    } catch (error) {
      console.error(error);
      setMensaje("Error al buscar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarSolicitud = async (idUsuario: number) => {
    if (!usuarioLogueadoId) return;
    try {
      await axios.post(
        `http://localhost:4000/api/usuarios/${usuarioLogueadoId}/solicitudes`,
        { usuario1: usuarioLogueadoId, usuario2: idUsuario },
        { withCredentials: true }
      );
      fetchSolicitudes();
    } catch (error) {
      console.error(error);
      setMensaje("Error al enviar la solicitud.");
    }
  };

  const handleAceptarSolicitud = async (idSolicitud: number) => {
    try {
      await axios.put(
        `http://localhost:4000/api/usuarios/${usuarioLogueadoId}/solicitudes/${idSolicitud}`,
        { estado_solicitud: "aceptada" }
      );
      fetchSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRechazarSolicitud = async (idSolicitud: number) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/usuarios/${usuarioLogueadoId}/solicitudes/${idSolicitud}`
      );
      fetchSolicitudes();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <main className="flex-1 p-6 max-w-4xl mx-auto space-y-6">
        {mensaje && <p className="text-red-500">{mensaje}</p>}
        {loading && <p className="text-gray-600">Cargando...</p>}

        {/* AMIGOS */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">Mis amigos</h2>
          {amigos.length === 0 && <p>No tienes amigos.</p>}
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {(verTodosAmigos ? amigos : amigos.slice(0, 5)).map((amigo) => (
              <li
                key={amigo.id}
                className="flex items-center gap-3 border p-2 rounded cursor-pointer"
                onClick={() => setUsuarioDetalle(amigo)}
              >
                <img
                  src={amigo.foto || placeholderImg}
                  className="w-12 h-12 rounded-full object-cover"
                  alt="foto amigo"
                />
                <div>
                  <p className="font-semibold">{amigo.nombre_usuario}</p>
                  {amigo.nombre && (
                    <p className="text-sm text-gray-600">{amigo.nombre} {amigo.apellidos}</p>
                  )}
                  <p className="text-xs text-gray-500">{amigo.correo}</p>
                </div>
              </li>
            ))}
          </ul>
          {amigos.length > 5 && (
            <button
              onClick={() => setVerTodosAmigos(!verTodosAmigos)}
              className="mt-2 text-sm text-yellow-600 hover:underline"
            >
              {verTodosAmigos ? "Ver menos" : "Ver todos"}
            </button>
          )}
        </div>

        {/* SOLICITUDES PENDIENTES */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">Solicitudes pendientes</h2>
          {solicitudesPendientes.length === 0 && <p>No tienes solicitudes pendientes.</p>}
          <ul className="space-y-2">
            {solicitudesPendientes.map((sol) => (
              <li
                key={sol.id}
                className="flex justify-between items-center border p-2 rounded cursor-pointer"
                onClick={() => setUsuarioDetalle(sol.usuario1)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={sol.usuario1.foto || placeholderImg}
                    alt="foto usuario"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{sol.usuario1.nombre_usuario}</p>
                    <p className="text-xs text-gray-500">{sol.usuario1.correo}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAceptarSolicitud(sol.id);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRechazarSolicitud(sol.id);
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* MODAL DETALLE USUARIO */}
        {usuarioDetalle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded p-6 w-96 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setUsuarioDetalle(null)}
              >
                ×
              </button>
              <img
                src={usuarioDetalle.foto || placeholderImg}
                alt="foto usuario"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-bold text-center">{usuarioDetalle.nombre_usuario}</h3>
              {usuarioDetalle.nombre && (
                <p className="text-center text-gray-700">{usuarioDetalle.nombre} {usuarioDetalle.apellidos}</p>
              )}
              <p className="text-center text-gray-500">{usuarioDetalle.correo}</p>
              {usuarioDetalle.ubicacion && <p className="text-center text-gray-500">{usuarioDetalle.ubicacion}</p>}
              {usuarioDetalle.genero && <p className="text-center text-gray-500">{usuarioDetalle.genero}</p>}
              {usuarioDetalle.pais && <p className="text-center text-gray-500">{usuarioDetalle.pais}</p>}
              {usuarioDetalle.fecha_nacimiento && <p className="text-center text-gray-500">{usuarioDetalle.fecha_nacimiento}</p>}
              {usuarioDetalle.texto_introduccion && <p className="mt-2 text-gray-700">{usuarioDetalle.texto_introduccion}</p>}
            </div>
          </div>
        )}

        {/* BUSCAR NUEVOS AMIGOS */}
        <div className="border rounded p-4">
          <h2 className="text-xl font-bold mb-2">Buscar nuevos amigos</h2>
          <div className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o email"
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-300"
            />
            <button
              onClick={handleBuscar}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
            >
              Buscar
            </button>
          </div>
          <ul className="space-y-2">
            {resultados.map((usuario) => {
              const esAmigo = amigos.some((a) => a.id === usuario.id);
              const yaEnviada = solicitudesEnviadas.some((s) => s.usuario2.id === usuario.id);
              const yaRecibida = solicitudesPendientes.some((s) => s.usuario1.id === usuario.id);
              const bloqueado = esAmigo || yaEnviada || yaRecibida;
              return (
                <li
                  key={usuario.id}
                  className="flex items-center gap-3 border p-2 rounded cursor-pointer"
                  onClick={() => setUsuarioDetalle(usuario)}
                >
                  <img
                    src={usuario.foto || placeholderImg}
                    className="w-12 h-12 rounded-full object-cover"
                    alt="foto usuario"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{usuario.nombre_usuario}</p>
                    {usuario.nombre && (
                      <p className="text-sm text-gray-600">{usuario.nombre} {usuario.apellidos}</p>
                    )}
                    <p className="text-xs text-gray-500">{usuario.correo}</p>
                  </div>
                  <button
                    disabled={bloqueado}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEnviarSolicitud(usuario.id);
                    }}
                    className={
                      bloqueado
                        ? "bg-gray-400 text-white px-3 py-1 rounded cursor-not-allowed"
                        : "bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
                    }
                  >
                    {esAmigo
                      ? "Ya es amigo"
                      : yaEnviada
                      ? "Solicitud enviada"
                      : yaRecibida
                      ? "Te ha enviado solicitud"
                      : "Enviar solicitud"}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </MainLayout>
  );
};

export default Amigos;
