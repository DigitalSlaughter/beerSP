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

  // Listas completas cacheadas
  const [allCervezas, setAllCervezas] = useState<Cerveza[]>([]);
  const [allLocales, setAllLocales] = useState<Local[]>([]);

  // Estados de búsqueda y resultados filtrados
  const [busquedaCerveza, setBusquedaCerveza] = useState("");
  const [cervezas, setCervezas] = useState<Cerveza[]>([]); // Resultados filtrados
  const [cervezaSeleccionada, setCervezaSeleccionada] =
    useState<Cerveza | null>(null);

  const [busquedaLocal, setBusquedaLocal] = useState("");
  const [locales, setLocales] = useState<Local[]>([]); // Resultados filtrados
  const [localSeleccionado, setLocalSeleccionado] = useState<Local | null>(
    null
  );

  const [puntuacion, setPuntuacion] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [paisDegustacion, setPaisDegustacion] = useState("");
  const [meGusta, setMeGusta] = useState(false);

  const [mensaje, setMensaje] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingCervezas, setLoadingCervezas] = useState(true);
  const [loadingLocales, setLoadingLocales] = useState(true);

  // Estado para la imagen ampliada
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);


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
    me_gusta: false,
  });

  // -------------------------
  // Cargar datos iniciales (TODA la lista)
  // -------------------------
  useEffect(() => {
    const fetchAllData = async () => {
      // Fetch Cervezas
      try {
        setLoadingCervezas(true);
        const res = await axios.get("http://localhost:4000/api/cervezas", {
          withCredentials: true,
        });
        setAllCervezas(res.data || []);
      } catch (err) {
        console.error("Error fetching all beers:", err);
        setMensaje("Error al cargar lista de cervezas");
      } finally {
        setLoadingCervezas(false);
      }

      // Fetch Locales
      try {
        setLoadingLocales(true);
        const res = await axios.get("http://localhost:4000/api/locales", {
          withCredentials: true,
        });
        setAllLocales(res.data || []);
      } catch (err) {
        console.error("Error fetching all locals:", err);
        setMensaje("Error al cargar lista de locales");
      } finally {
        setLoadingLocales(false);
      }
    };
    fetchAllData();
  }, []); // Se ejecuta solo al montar el componente

  // -------------------------
  // Búsqueda (filtrado) de cervezas
  // -------------------------
useEffect(() => {
  if (busquedaCerveza.trim().length < 1) {
    setCervezas(allCervezas); // Muestra todo si no hay búsqueda
    return;
  }
  const filtered = allCervezas.filter((c) =>
    c.nombre_cerveza.toLowerCase().includes(busquedaCerveza.toLowerCase())
  );
  setCervezas(filtered);
}, [busquedaCerveza, allCervezas]);

  // -------------------------
  // Búsqueda (filtrado) locales
  // -------------------------
  useEffect(() => {
    if (busquedaLocal.trim().length < 1) {
      setLocales(allLocales);
      return;
    }

    // Filtra la lista completa en el frontend
    const filtered = allLocales.filter((l) =>
      l.nombre_local.toLowerCase().includes(busquedaLocal.toLowerCase())
    );
    setLocales(filtered);
  }, [busquedaLocal, allLocales]); // Depende de la búsqueda y de la lista completa

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

      // Añade la nueva cerveza a la lista completa y la selecciona
      setAllCervezas([...allCervezas, res.data]);
      setCervezaSeleccionada(res.data);
      setShowCrearCerveza(false);
      setNuevaCerveza({ /* reset state */
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
      setFotoNuevaCerveza(null);

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

      // Añade el nuevo local a la lista completa y lo selecciona
      setAllLocales([...allLocales, res.data]);
      setLocalSeleccionado(res.data);
      setShowCrearLocal(false);
      setNuevoLocal({ nombre_local: "", direccion: "", coordenadas: "", me_gusta: false });

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
    setMensaje(null); // Limpiar mensaje previo

    if (!cervezaSeleccionada) {
      setMensaje("Debe seleccionar o crear una cerveza.");
      return;
    }
    if (!localSeleccionado) {
      setMensaje("Debe seleccionar o crear un local.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMensaje(
          "No se encontró token de autenticación. Debe iniciar sesión."
        );
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
          me_gusta: meGusta,
        },
        { withCredentials: true }
      );

      setMensaje("Degustación creada correctamente.");
      if (onSuccess) onSuccess();
      
      // Opcional: cerrar el modal tras éxito
      // if (onClose) onClose();

    } catch (error: any) {
      console.error("Error al crear degustación:", error);
      setMensaje("Error al crear degustación");
    } finally {
      setLoading(false);
    }
  };

  const placeholderImg = "https://placehold.co/64x64/EBF4FF/7F9CF5?text=Cerveza";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded shadow p-4 relative mb-10">
        <h2 className="text-xl font-bold mb-4">Registrar degustación</h2>

        {mensaje && (
           <p className={`mb-3 p-2 rounded ${mensaje.includes("Error") ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {mensaje}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* CERVEZA */}
          <div className="relative"> {/* Contenedor relativo para la lista absoluta */}
            <label className="font-semibold">Cerveza</label>
            <div className="flex gap-2 items-center">
              <input
                value={
                  cervezaSeleccionada
                    ? cervezaSeleccionada.nombre_cerveza
                    : busquedaCerveza
                }
                onChange={(e) => {
                  setBusquedaCerveza(e.target.value);
                  setCervezaSeleccionada(null); // Deselecciona si empieza a escribir
                }}
                disabled={!!cervezaSeleccionada} // Deshabilitar si hay una seleccionada
                placeholder={
                  loadingCervezas ? "Cargando cervezas..." : "Buscar cerveza..."
                }
                className="border p-2 rounded w-full disabled:bg-gray-100 disabled:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowCrearCerveza(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500 whitespace-nowrap"
              >
                Crear
              </button>
            </div>

            {/* --- Resultados de búsqueda de Cerveza --- */}
            {cervezas.length > 0 && !cervezaSeleccionada && (
              <ul className="border max-h-60 overflow-y-auto rounded bg-white mt-1 absolute z-20 w-full shadow-lg">
                {cervezas.map((c) => (
                  <li
                    key={c.id}
                    className="p-3 cursor-pointer hover:bg-gray-100 flex items-start gap-3 transition"
                    onClick={() => {
                      setCervezaSeleccionada(c);
                      setBusquedaCerveza(""); // Limpia la búsqueda
                      setCervezas([]); // Cierra la lista
                    }}
                  >
                    <img
                      src={c.foto || placeholderImg}
                      alt={c.nombre_cerveza}
                      className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80 transition"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que se seleccione la cerveza
                        setImagenAmpliada(c.foto ?? null);
                      }}
                      onError={(e) => (e.currentTarget.src = placeholderImg)}
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-gray-800">
                        {c.nombre_cerveza}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {c.descripcion || "Sin descripción"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {c.estilo} - {c.pais_procedencia}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* --- Cerveza Seleccionada --- */}
            {cervezaSeleccionada && (
              <div className="mt-2 p-3 border rounded bg-gray-50 flex items-start gap-3">
                <img
                  src={cervezaSeleccionada.foto || placeholderImg}
                  alt={cervezaSeleccionada.nombre_cerveza}
                  className="w-16 h-16 rounded object-cover cursor-pointer hover:opacity-80 transition"
                  onClick={() =>
                    setImagenAmpliada(cervezaSeleccionada.foto ?? null)
                  }
                  onError={(e) => (e.currentTarget.src = placeholderImg)}
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-800">
                    {cervezaSeleccionada.nombre_cerveza}
                  </p>
                  <p className="text-sm text-gray-600">
                    {cervezaSeleccionada.descripcion || "Sin descripción"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCervezaSeleccionada(null)}
                  className="text-red-500 hover:text-red-700 font-semibold text-xl"
                >
                  &times;
                </button>
              </div>
            )}
          </div>

          {/* LOCAL */}
          <div className="relative"> {/* Contenedor relativo */}
            <label className="font-semibold">Local</label>
            <div className="flex gap-2 items-center">
              <input
                value={
                  localSeleccionado
                    ? localSeleccionado.nombre_local
                    : busquedaLocal
                }
                onChange={(e) => {
                  setBusquedaLocal(e.target.value);
                  setLocalSeleccionado(null);
                }}
                disabled={!!localSeleccionado}
                placeholder={
                  loadingLocales ? "Cargando locales..." : "Buscar local..."
                }
                className="border p-2 rounded w-full disabled:bg-gray-100 disabled:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowCrearLocal(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-500 whitespace-nowrap"
              >
                Crear
              </button>
            </div>

            {/* --- Resultados de búsqueda de Local --- */}
            {locales.length > 0 && !localSeleccionado && (
              <ul className="border max-h-40 overflow-y-auto rounded bg-white mt-1 absolute z-10 w-full shadow-lg">
                {locales.map((l) => (
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

            {/* --- Local Seleccionado --- */}
             {localSeleccionado && (
              <div className="mt-2 p-3 border rounded bg-gray-50 flex items-center justify-between">
                <p className="font-bold text-gray-800">
                  {localSeleccionado.nombre_local}
                </p>
                 <button
                  type="button"
                  onClick={() => setLocalSeleccionado(null)}
                  className="text-red-500 hover:text-red-700 font-semibold text-xl"
                >
                  &times;
                </button>
              </div>
             )}

          </div>

          {/* CAMPOS DEGUSTACIÓN */}
          <input
            type="number"
            min={0}
            max={5}
            step={0.5} // Permite puntuaciones decimales
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
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={meGusta}
              onChange={(e) => setMeGusta(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            ¿Te gustó?
          </label>
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-500 disabled:bg-gray-400"
          >
            {loading ? "Guardando..." : "Guardar degustación"}
          </button>
        </form>

        {/* Botón de cerrar principal */}
        {onClose && (
           <button
             onClick={onClose}
             className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-2xl"
           >
             &times;
           </button>
        )}

        {/* MODAL CREAR CERVEZA */}
        {showCrearCerveza && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-4 rounded shadow w-full max-w-md relative flex flex-col gap-2 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-2">Crear nueva cerveza</h3>
              <button
                onClick={() => setShowCrearCerveza(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              >
                &times;
              </button>

              {/* NOMBRE */}
              <input
                placeholder="Nombre de la cerveza"
                value={nuevaCerveza.nombre_cerveza}
                onChange={(e) =>
                    setNuevaCerveza({ ...nuevaCerveza, nombre_cerveza: e.target.value })
                }
                className="border p-2 rounded"
               />
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
                <option>Otra</option>
              </select>

              {/* PAÍS */}
              <input
                placeholder="País de procedencia"
                value={nuevaCerveza.pais_procedencia}
                onChange={(e) =>
                  setNuevaCerveza({
                    ...nuevaCerveza,
                    pais_procedencia: e.target.value,
                  })
                }
                className="border p-2 rounded"
              />

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
                <option>Otro</option>
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
                <option>Otro</option>
              </select>

              {/* ALCOHOL */}
              <input
                placeholder="% Alcohol"
                type="number"
                step="0.1"
                value={nuevaCerveza.porcentaje_alcohol}
                onChange={(e) =>
                  setNuevaCerveza({
                    ...nuevaCerveza,
                    porcentaje_alcohol: parseFloat(e.target.value) || 0,
                  })
                }
                className="border p-2 rounded"
              />

              {/* AMARGOR */}
              <input
                placeholder="Amargor (IBU)"
                type="number"
                value={nuevaCerveza.amargor}
                onChange={(e) =>
                  setNuevaCerveza({
                    ...nuevaCerveza,
                    amargor: parseFloat(e.target.value) || 0,
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
                <option>Otro</option>
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
              <label className="text-sm font-medium">Foto (opcional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setFotoNuevaCerveza(e.target.files[0])
                }
                className="text-sm"
              />

              <button
                onClick={handleCrearCerveza}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 mt-2"
              >
                Crear
              </button>
            </div>
          </div>
        )}

        {/* MODAL CREAR LOCAL */}
        {showCrearLocal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-4 rounded shadow w-full max-w-md relative flex flex-col gap-2">
              <h3 className="text-lg font-bold mb-2">Crear nuevo local</h3>
              <button
                onClick={() => setShowCrearLocal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
              >
                &times;
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
                placeholder="Coordenadas (opcional)"
                value={nuevoLocal.coordenadas}
                onChange={(e) =>
                  setNuevoLocal({ ...nuevoLocal, coordenadas: e.target.value })
                }
                className="border p-2 rounded"
              />

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nuevoLocal.me_gusta}
                  onChange={(e) =>
                    setNuevoLocal({ ...nuevoLocal, me_gusta: e.target.checked })
                  }
                  className="h-4 w-4 rounded"
                />
                ¿Te gusta?
              </label>

              <button
                onClick={handleCrearLocal}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 mt-2"
              >
                Crear
              </button>
            </div>
          </div>
        )}

        {/* MODAL IMAGEN AMPLIADA */}
        {imagenAmpliada && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[60] p-4" // z-index más alto
            onClick={() => setImagenAmpliada(null)} // Cierra al hacer clic fuera
          >
            <img
              src={imagenAmpliada}
              alt="Imagen ampliada"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()} // Evita que el clic en la imagen cierre el modal
            />
            <button
              onClick={() => setImagenAmpliada(null)}
              className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DegustacionModal;