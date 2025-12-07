// src/tests/integration/integracion.test.ts
import { mockRequest, mockResponse } from './../utils/expressMocks';
import { UsuarioController } from '../../controllers/UsuarioController';
import { CervezaController } from '../../controllers/CervezaController';
import { LocalController } from '../../controllers/LocalController';
import { DegustacionController } from '../../controllers/DegustacionController';
import { SolicitudAmistadController } from '../../controllers/SolicitudAmistadController';

// -------------------
// FAKE REPO GLOBAL
// -------------------
const fakeRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

// -------------------
// CONTROLLERS
// -------------------
const usuarioCtrl = new UsuarioController();
const cervezaCtrl = new CervezaController();
const localCtrl = new LocalController();
const degustacionCtrl = new DegustacionController();
const solicitudCtrl = new SolicitudAmistadController();

describe('Pruebas de integración - flujo completo', () => {
  let usuarioId: number;
  let cervezaId: number;
  let localId: number;
  let degustacionId: number;
  let solicitudId: number;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('flujo completo: usuario -> cerveza -> local -> degustación -> solicitud', async () => {
    // ---------- USUARIO ----------
    const userPayload = { nombre_usuario: 'sysuser', correo: 'sysuser@example.com', password: '123' };
    fakeRepo.create.mockReturnValue(userPayload);
    fakeRepo.save.mockResolvedValue({ id: 1, ...userPayload });
    const reqUser = mockRequest({ body: userPayload });
    const resUser = mockResponse();

    await usuarioCtrl.crearUsuario(reqUser, resUser);
    usuarioId = resUser.json.mock.calls[0][0].id;

    // ---------- CERVEZA ----------
    const beerPayload = {
      nombre_cerveza: 'Sistema Cerveza',
      estilo: 'IPA',
      pais_procedencia: 'ES',
      size: '500ml',
      formato: 'Botella',
      porcentaje_alcohol: 5,
      amargor: 40,
      color: 'Ambar',
    };
    fakeRepo.create.mockReturnValue(beerPayload);
    fakeRepo.save.mockResolvedValue({ id: 1, ...beerPayload });
    const reqBeer = mockRequest({ body: beerPayload });
    const resBeer = mockResponse();

    await cervezaCtrl.crear(reqBeer, resBeer);
    cervezaId = resBeer.json.mock.calls[0][0].id;

    // ---------- LOCAL ----------
    const localPayload = { nombre_local: 'Sistema Bar', direccion: 'Calle Principal 1' };
    fakeRepo.create.mockReturnValue(localPayload);
    fakeRepo.save.mockResolvedValue({ id: 1, ...localPayload });
    const reqLocal = mockRequest({ body: localPayload });
    const resLocal = mockResponse();

    await localCtrl.crear(reqLocal, resLocal);
    localId = resLocal.json.mock.calls[0][0].id;

    // ---------- DEGUSTACIÓN ----------
    const degPayload = {
      usuario_id: usuarioId,
      cerveza_id: cervezaId,
      local_id: localId,
      puntuacion: 10,
      comentario: 'Excelente',
      pais_degustacion: 'ES',
      me_gusta: true,
    };
    fakeRepo.create.mockReturnValue(degPayload);
    fakeRepo.save.mockResolvedValue({ id: 1, ...degPayload });
    const reqDeg = mockRequest({ body: degPayload });
    const resDeg = mockResponse();

    await degustacionCtrl.crear(reqDeg, resDeg);
    degustacionId = resDeg.json.mock.calls[0][0].id;

    // ---------- SOLICITUD DE AMISTAD ----------
    const solPayload = { usuario1: usuarioId, usuario2: usuarioId + 1, estado_solicitud: 'pendiente' };
    fakeRepo.create.mockReturnValue(solPayload);
    fakeRepo.save.mockResolvedValue({ id: 1, ...solPayload });
    const reqSol = mockRequest({ body: solPayload, params: { idUsuario: usuarioId } });
    const resSol = mockResponse();

    await solicitudCtrl.crear(reqSol, resSol);
    solicitudId = resSol.json.mock.calls[0][0].id;

    // ---------- EXPECTS ----------
    expect(resUser.status).toHaveBeenCalledWith(201);
    expect(resBeer.status).toHaveBeenCalledWith(201);
    expect(resLocal.status).toHaveBeenCalledWith(201);
    expect(resDeg.status).toHaveBeenCalledWith(201);
    expect(resSol.status).toHaveBeenCalledWith(201);
  });

  afterAll(async () => {
    // Simula borrado
    if (degustacionId) await fakeRepo.remove({ id: degustacionId });
    if (solicitudId) await fakeRepo.remove({ id: solicitudId });
    if (localId) await fakeRepo.remove({ id: localId });
    if (cervezaId) await fakeRepo.remove({ id: cervezaId });
    if (usuarioId) await fakeRepo.remove({ id: usuarioId });
  });
});
