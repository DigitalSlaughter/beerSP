// src/tests/general.test.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

// -------------------------
// Interfaces de los modelos
// -------------------------
interface Usuario {
  id: number;
  nombre_usuario: string;
  correo: string;
  nombre?: string;
}

interface Cerveza {
  id: number;
  nombre_cerveza: string;
  estilo: string;
  pais_procedencia: string;
  size: string;
  formato: string;
  porcentaje_alcohol: number;
  amargor: number;
  color: string;
  descripcion?: string;
}

interface Local {
  id: number;
  nombre_local: string;
  direccion: string;
}

interface Degustacion {
  id: number;
  usuario_id?: number;
  cerveza_id?: number;
  local_id?: number;
  puntuacion?: number;
  comentario?: string;
  pais_degustacion?: string;
  me_gusta?: boolean;
}

interface SolicitudAmistad {
  id: number;
  usuario1: number;
  usuario2: number;
  estado_solicitud: "pendiente" | "aceptada" | "rechazada" | "cancelada";
}

// -------------------------
// Tests generales
// -------------------------
describe("Pruebas generales del sistema", () => {
  let usuarioId: number;
  let cervezaId: number;
  let localId: number;
  let degustacionId: number;
  let solicitudId: number;

  // ---------- USUARIOS ----------
  it("Crear usuario", async () => {
    const res = await api.post<Usuario>("/usuarios", {
      nombre_usuario: "testuser",
      correo: "testuser@example.com",
      password: "123456",
    });
    expect(res.status).toBe(201);
    expect(res.data.id).toBeDefined();
    usuarioId = res.data.id;
  });

  it("Listar usuarios", async () => {
    const res = await api.get<Usuario[]>("/usuarios");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("Actualizar usuario", async () => {
    const res = await api.put<Usuario>(`/usuarios/${usuarioId}`, {
      nombre: "Nombre Test",
    });
    expect(res.status).toBe(200);
    expect(res.data.nombre).toBe("Nombre Test");
  });

  // ---------- CERVEZAS ----------
  it("Crear cerveza", async () => {
    const res = await api.post<Cerveza>("/cervezas", {
      nombre_cerveza: "Test Cerveza",
      estilo: "IPA",
      pais_procedencia: "España",
      size: "500ml",
      formato: "Botella",
      porcentaje_alcohol: 5,
      amargor: 40,
      color: "Ambar",
      descripcion: "Cerveza de prueba",
    });
    expect(res.status).toBe(201);
    expect(res.data.id).toBeDefined();
    cervezaId = res.data.id;
  });

  it("Listar cervezas", async () => {
    const res = await api.get<Cerveza[]>("/cervezas");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("Actualizar cerveza", async () => {
    const res = await api.put<Cerveza>(`/cervezas/${cervezaId}`, {
      estilo: "Lager",
    });
    expect(res.status).toBe(200);
    expect(res.data.estilo).toBe("Lager");
  });

  // ---------- LOCALES ----------
  it("Crear local", async () => {
    const res = await api.post<Local>("/locales", {
      nombre_local: "Local Test",
      direccion: "Calle Falsa 123",
    });
    expect(res.status).toBe(201);
    expect(res.data.id).toBeDefined();
    localId = res.data.id;
  });

  it("Listar locales", async () => {
    const res = await api.get<Local[]>("/locales");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("Actualizar local", async () => {
    const res = await api.put<Local>(`/locales/${localId}`, {
      direccion: "Nueva Dirección 456",
    });
    expect(res.status).toBe(200);
    expect(res.data.direccion).toBe("Nueva Dirección 456");
  });

  // ---------- DEGUSTACIONES ----------
  it("Crear degustación", async () => {
    const res = await api.post<Degustacion>("/degustaciones", {
      usuario_id: usuarioId,
      cerveza_id: cervezaId,
      local_id: localId,
      puntuacion: 8,
      comentario: "Muy buena",
      pais_degustacion: "España",
      me_gusta: true,
    });
    expect(res.status).toBe(201);
    expect(res.data.id).toBeDefined();
    degustacionId = res.data.id;
  });

  it("Listar degustaciones", async () => {
    const res = await api.get<Degustacion[]>("/degustaciones");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("Actualizar degustación", async () => {
    const res = await api.put<Degustacion>(`/degustaciones/${degustacionId}`, {
      puntuacion: 9,
    });
    expect(res.status).toBe(200);
    expect(res.data.puntuacion).toBe(9);
  });

  // ---------- SOLICITUDES AMISTAD ----------
  it("Crear solicitud de amistad", async () => {
    const res = await api.post<SolicitudAmistad>("/solicitudes", {
      usuario1: usuarioId,
      usuario2: usuarioId,
      estado_solicitud: "pendiente",
    });
    expect(res.status).toBe(201);
    expect(res.data.id).toBeDefined();
    solicitudId = res.data.id;
  });

  it("Listar solicitudes de amistad", async () => {
    const res = await api.get<SolicitudAmistad[]>("/solicitudes");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it("Actualizar solicitud de amistad", async () => {
    const res = await api.put<SolicitudAmistad>(`/solicitudes/${solicitudId}`, {
      estado_solicitud: "aceptada",
    });
    expect(res.status).toBe(200);
    expect(res.data.estado_solicitud).toBe("aceptada");
  });

  // ---------- PRUEBA DE SISTEMA ----------
  it("Flujo completo: usuario -> cerveza -> local -> degustación -> solicitud", async () => {
    // Crear usuario nuevo
    const userRes = await api.post<Usuario>("/usuarios", {
      nombre_usuario: "sysuser",
      correo: "sysuser@example.com",
      password: "abcdef",
    });
    expect(userRes.status).toBe(201);
    const userId = userRes.data.id;

    // Crear cerveza
    const beerRes = await api.post<Cerveza>("/cervezas", {
      nombre_cerveza: "Sistema Cerveza",
      estilo: "Stout",
      pais_procedencia: "Alemania",
      size: "330ml",
      formato: "Lata",
      porcentaje_alcohol: 6,
      amargor: 35,
      color: "Oscuro",
    });
    expect(beerRes.status).toBe(201);
    const beerId = beerRes.data.id;

    // Crear local
    const localRes = await api.post<Local>("/locales", {
      nombre_local: "Sistema Bar",
      direccion: "Calle Principal 1",
    });
    expect(localRes.status).toBe(201);
    const localId = localRes.data.id;

    // Registrar degustación
    const degRes = await api.post<Degustacion>("/degustaciones", {
      usuario_id: userId,
      cerveza_id: beerId,
      local_id: localId,
      puntuacion: 10,
      comentario: "Excelente",
      pais_degustacion: "Alemania",
      me_gusta: true,
    });
    expect(degRes.status).toBe(201);
    expect(degRes.data.usuario_id).toBe(userId);
    expect(degRes.data.cerveza_id).toBe(beerId);
    expect(degRes.data.local_id).toBe(localId);
    const degId = degRes.data.id;

    // Crear solicitud de amistad entre usuario nuevo y usuario original
    const solRes = await api.post<SolicitudAmistad>("/solicitudes", {
      usuario1: userId,
      usuario2: usuarioId,
      estado_solicitud: "pendiente",
    });
    expect(solRes.status).toBe(201);
    expect(solRes.data.usuario1).toBe(userId);
    expect(solRes.data.usuario2).toBe(usuarioId);
    const solId = solRes.data.id;

    // Limpieza de datos
    await api.delete(`/degustaciones/${degId}`);
    await api.delete(`/solicitudes/${solId}`);
    await api.delete(`/locales/${localId}`);
    await api.delete(`/cervezas/${beerId}`);
    await api.delete(`/usuarios/${userId}`);
  });

  // ---------- LIMPIEZA DE DATOS ----------
  afterAll(async () => {
    if (degustacionId) await api.delete(`/degustaciones/${degustacionId}`);
    if (solicitudId) await api.delete(`/solicitudes/${solicitudId}`);
    if (localId) await api.delete(`/locales/${localId}`);
    if (cervezaId) await api.delete(`/cervezas/${cervezaId}`);
    if (usuarioId) await api.delete(`/usuarios/${usuarioId}`);
  });
});
