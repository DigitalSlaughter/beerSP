import React, { useEffect, useState, FormEvent } from "react";
import axios from "axios";

interface Props {
  onClose?: () => void;
  onSuccess?: () => void;
}

interface Cerveza {
  id?: number;
  nombre_cerveza: string;
  estilo: string;
  pais_procedencia: string;
  size: string;
  formato: string;
  porcentaje_alcohol: number;
  amargor: number;
  color: string;
  descripcion?: string;
  foto?: string;
}

interface Local {
  id?: number;
  nombre_local: string;
  direccion: string;
  coordenadas?: string;
  me_gusta?: boolean;
}

const DegustacionModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  // -------------------------
  // Estados principales
  // -------------------------
  const [busquedaCerveza, setBusquedaCerveza] = useState("");
  const [cervezas, setCervezas] = useState<Cerveza[]>([]);
  const [cervezaSeleccionada, setCervezaSeleccionada] = useState<Cerveza | null>(null);

  const [busquedaLocal, setBusquedaLocal] = useState("");
  const [locales, setLocales] = useState<Local[]>([]);
  const [localSeleccionado, setLocalSeleccionado] = useState<Local | null>(null);

  const [puntuacion, setPuntuacion] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [paisDegustacion, setPaisDegustacion] = useState("");
  const [meGusta, setMeGusta] = useState(false);

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // -------------------------
  // Estados de los diálogos
  // -------------------------
  const [showCrearCerveza, setShowCrearCerveza] = useState(false);
  const [nuevaCerveza, setNuevaCerveza] = useState<Cerveza>({
    nombre_cerveza: "",
    estilo: "",
    pais_procedencia: "",
    size: "",
    formato: "",
    porcentaje_alcohol: 0,
    amargor: 0,
    color: "",
    descripcion: "",
  });
  const [fotoNuevaCerveza, setFotoNuevaCerveza] = useState<File | null>(null);

  const [showCrearLocal, setShowCrearLocal] = useState(false);
  const [nuevoLocal, setNuevoLocal] = useState<Local>({
    nombre_local: "",
    direccion: "",
    coordenadas: "",
    me_gusta: false
  });

  // -------------------------
  // Búsqueda de cervezas
  // -------------------------
  useEffect(() => {
    if (busquedaCerveza.trim().length < 2) {
      setCervezas([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/cervezas?search=${encodeURIComponent(busquedaCerveza)}`,
          { withCredentials: true }
        );
        setCervezas(res.data || []);
      } catch {
        setCervezas([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [busquedaCerveza]);

  // -------------------------
  // Búsqueda locales
  // -------------------------
  useEffect(() => {
    if (busquedaLocal.trim().length < 2) {
      setLocales([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/locales?search=${encodeURIComponent(busquedaLocal)}`,
          { withCredentials: true }
        );
        setLocales(res.data || []);
      } catch {
        setLocales([]);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [busquedaLocal]);

  // -------------------------
  // CREAR CERVEZA
  // -------------------------
  const handleCrearCerveza = async () => {
    try {
      const formData = new FormData();
      Object.entries(nuevaCerveza).forEach(([key, value]) => {
        formData.append(key, value != null ? value.toString() : "");
      });
      if (fotoNuevaCerveza) formData.append("foto", fotoNuevaCerveza);

      const res = await axios.post(
        "http://localhost:4000/api/cervezas",
        formData,
        { withCredentials: true }
      );

      setCervezaSeleccionada(res.data);
      setShowCrearCerveza(false);

    } catch (e) {
      console.error("Error al crear cerveza:", e);
      alert("Error al crear cerveza");
    }
  };

  // -------------------------
  // CREAR LOCAL
  // -------------------------
  const handleCrearLocal = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/locales",
        nuevoLocal,
        { withCredentials: true }
      );

      setLocalSeleccionado(res.data);
      setShowCrearLocal(false);

    } catch (e) {
      console.error(e);
      alert("Error al crear local");
    }
  };

  // -------------------------
  // CREAR DEGUSTACIÓN
  // -------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cervezaSeleccionada) return alert("Debe seleccionar o crear una cerveza.");
    if (!localSeleccionado) return alert("Debe seleccionar o crear un local.");

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMensaje("No se encontró token de autenticación. Debe iniciar sesión.");
        setLoading(false);
        return;
      }

      let usuarioId: number;
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        usuarioId = userData.id;
      } catch {
        setMensaje("Token inválido. Debe iniciar sesión nuevamente.");
        setLoading(false);
        return;
      }

      await axios.post(
        "http://localhost:4000/api/degustaciones",
        {
          usuarioId,
          cervezaId: cervezaSeleccionada.id,
          localId: localSeleccionado.id,
          puntuacion: puntuacion ?? null,
          comentario: comentario || "",
          pais_degustacion: paisDegustacion || "",
          me_gusta: meGusta
        },
        { withCredentials: true }
      );

      setMensaje("Degustación creada correctamente.");
      if (onSuccess) onSuccess();

    } catch (error: any) {
      console.error("Error al crear degustación:", error);
      setMensaje("Error al crear degustación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
      <div className="bg-white w-full max-w-2xl rounded shadow p-4 relative">
        <h2 className="text-xl font-bold mb-4">Registrar degustación</h2>

        {mensaje && <p className="text-green-700 mb-3">{mensaje}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* CERVEZA */}
          <div>
            <label className="font-semibold">Cerveza</label>
            <div className="flex gap-2 items-center">
              <input
                value={cervezaSeleccionada ? cervezaSeleccionada.nombre_cerveza : busquedaCerveza}
                onChange={(e) => {
                  setBusquedaCerveza(e.target.value);
                  setCervezaSeleccionada(null);
                }}
                placeholder="Buscar cerveza..."
                className="border p-2 rounded w-full"
              />
              <button
                type="button"
                onClick={() => setShowCrearCerveza(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500"
              >
                Crear
              </button>
            </div>

            {cervezas.length > 0 && !cervezaSeleccionada && (
              <ul className="border max-h-40 overflow-y-auto rounded bg-white mt-2">
                {cervezas.map(c => (
                  <li
                    key={c.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setCervezaSeleccionada(c);
                      setBusquedaCerveza("");
                      setCervezas([]);
                    }}
                  >
                    {c.nombre_cerveza}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* LOCAL */}
          <div>
            <label className="font-semibold">Local</label>
            <div className="flex gap-2 items-center">
              <input
                value={localSeleccionado ? localSeleccionado.nombre_local : busquedaLocal}
                onChange={(e) => {
                  setBusquedaLocal(e.target.value);
                  setLocalSeleccionado(null);
                }}
                placeholder="Buscar local..."
                className="border p-2 rounded w-full"
              />
              <button
                type="button"
                onClick={() => setShowCrearLocal(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500"
              >
                Crear
              </button>
            </div>

            {locales.length > 0 && !localSeleccionado && (
              <ul className="border max-h-40 overflow-y-auto rounded bg-white mt-2">
                {locales.map(l => (
                  <li
                    key={l.id}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setLocalSeleccionado(l);
                      setBusquedaLocal("");
                      setLocales([]);
                    }}
                  >
                    {l.nombre_local}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CAMPOS DEGUSTACIÓN */}
          <input
            type="number"
            min={0}
            max={5}
            value={puntuacion ?? ""}
            onChange={(e) =>
              setPuntuacion(e.target.value === "" ? null : Number(e.target.value))
            }
            placeholder="Puntuación (0-5)"
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="País de degustación"
            value={paisDegustacion}
            onChange={(e) => setPaisDegustacion(e.target.value)}
            className="border p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={meGusta}
              onChange={(e) => setMeGusta(e.target.checked)}
            />
            ¿Te gustó?
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500"
          >
            {loading ? "Guardando..." : "Guardar degustación"}
          </button>
        </form>

        {/* MODAL CREAR CERVEZA */}
        {showCrearCerveza && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow w-full max-w-md relative flex flex-col gap-2">
              <h3 className="text-lg font-bold mb-2">Crear nueva cerveza</h3>
              <button
                onClick={() => setShowCrearCerveza(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                ✖
              </button>

              {/* NOMBRE */}
              <select
                value={nuevaCerveza.nombre_cerveza}
                onChange={(e) =>
                  setNuevaCerveza({ ...nuevaCerveza, nombre_cerveza: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Selecciona una cerveza</option>
                <option value="Mahou">Mahou</option>
                <option value="Estrella Galicia">Estrella Galicia</option>
                <option value="Heineken">Heineken</option>
                <option value="Ambar">Ambar</option>
                <option value="Alhambra">Alhambra</option>
                <option value="San Miguel">San Miguel</option>
                <option value="Cruzcampo">Cruzcampo</option>
                <option value="Budweiser">Budweiser</option>
                <option value="Guinness">Guinness</option>
              </select>
              {/* ESTILO */}
              <select
                value={nuevaCerveza.estilo}
                onChange={(e) =>
                  setNuevaCerveza({ ...nuevaCerveza, estilo: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Seleccionar estilo</option>
                <option>Lager</option>
                <option>Pilsner</option>
                <option>IPA</option>
                <option>Pale Ale</option>
                <option>Stout</option>
                <option>Porter</option>
                <option>Trigo</option>
                <option>Sour</option>
              </select>

              {/* PAÍS */}
              <select
                value={nuevaCerveza.pais_procedencia}
                onChange={(e) =>
                  setNuevaCerveza({
                    ...nuevaCerveza,
                    pais_procedencia: e.target.value,
                  })
                }
                className="border p-2 rounded"
              >
                <option value="">País de procedencia</option>
                <option>España</option>
                <option>Alemania</option>
                <option>Bélgica</option>
                <option>Estados Unidos</option>
                <option>México</option>
                <option>Irlanda</option>
                <option>Países Bajos</option>
                <option>República Checa</option>
              </select>

              {/* TAMAÑO */}
              <select
                value={nuevaCerveza.size}
                onChange={(e) =>
                  setNuevaCerveza({ ...nuevaCerveza, size: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Tamaño</option>
                <option>250 ml</option>
                <option>330 ml</option>
                <option>500 ml</option>
                <option>1 L</option>
                <option>2 L</option>
              </select>

              {/* FORMATO */}
              <select
                value={nuevaCerveza.formato}
                onChange={(e) =>
                  setNuevaCerveza({ ...nuevaCerveza, formato: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Formato</option>
                <option>Botella</option>
                <option>Lata</option>
                <option>Barril</option>
              </select>

              {/* ALCOHOL */}
              <input
                placeholder="% Alcohol"
                type="number"
                value={nuevaCerveza.porcentaje_alcohol}
                onChange={(e) =>
                  setNuevaCerveza({
                    ...nuevaCerveza,
                    porcentaje_alcohol: parseFloat(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />

              {/* AMARGOR */}
              <input
                placeholder="Amargor"
                type="number"
                value={nuevaCerveza.amargor}
                onChange={(e) =>
                  setNuevaCerveza({
                    ...nuevaCerveza,
                    amargor: parseFloat(e.target.value),
                  })
                }
                className="border p-2 rounded"
              />

              {/* COLOR */}
              <select
                value={nuevaCerveza.color}
                onChange={(e) =>
                  setNuevaCerveza({ ...nuevaCerveza, color: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">Color</option>
                <option>Rubio</option>
                <option>Ámbar</option>
                <option>Tostado</option>
                <option>Negro</option>
              </select>

              {/* DESCRIPCIÓN */}
              <textarea
                placeholder="Descripción"
                value={nuevaCerveza.descripcion}
                onChange={(e) =>
                  setNuevaCerveza({
                    ...nuevaCerveza,
                    descripcion: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />

              {/* FOTO */}
              <input
                type="file"
                onChange={(e) =>
                  e.target.files && setFotoNuevaCerveza(e.target.files[0])
                }
              />

              <button
                onClick={handleCrearCerveza}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                Crear
              </button>
            </div>
          </div>
        )}

        {/* MODAL CREAR LOCAL */}
        {showCrearLocal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow w-full max-w-md relative flex flex-col gap-2">
              <h3 className="text-lg font-bold mb-2">Crear nuevo local</h3>
              <button
                onClick={() => setShowCrearLocal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                ✖
              </button>

              <input
                placeholder="Nombre"
                value={nuevoLocal.nombre_local}
                onChange={(e) =>
                  setNuevoLocal({ ...nuevoLocal, nombre_local: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                placeholder="Dirección"
                value={nuevoLocal.direccion}
                onChange={(e) =>
                  setNuevoLocal({ ...nuevoLocal, direccion: e.target.value })
                }
                className="border p-2 rounded"
              />
              <input
                placeholder="Coordenadas"
                value={nuevoLocal.coordenadas}
                onChange={(e) =>
                  setNuevoLocal({ ...nuevoLocal, coordenadas: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={nuevoLocal.me_gusta}
                  onChange={(e) =>
                    setNuevoLocal({ ...nuevoLocal, me_gusta: e.target.checked })
                  }
                />
                ¿Te gusta?
              </label>

              <button
                onClick={handleCrearLocal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                Crear
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DegustacionModal;
