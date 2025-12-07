// src/tests/unit/degustacion.controller.test.ts
import { mockRequest, mockResponse } from '../utils/expressMocks';

const degustacionServiceMock = {
  crear: jest.fn(),
  listar: jest.fn(),
  obtener: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn(),
};

const galardonServiceMock = {
  obtenerGalardonDef: jest.fn(),
  calcularNivel: jest.fn(),
  asignarGalardon: jest.fn(),
};

const usuarioRepoMock = {
  findOne: jest.fn(),
};

jest.mock('../../services/DegustacionService', () => {
  return { DegustacionService: jest.fn().mockImplementation(() => degustacionServiceMock) };
});
jest.mock('../../services/GalardonService', () => {
  return { GalardonService: jest.fn().mockImplementation(() => galardonServiceMock) };
});
jest.mock('../../repositories/UsuarioRepository', () => ({ UsuarioRepository: usuarioRepoMock }));

import { DegustacionController } from '../../controllers/DegustacionController';

describe('DegustacionController - unit', () => {
  let controller: DegustacionController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DegustacionController();
  });

  it('listar -> devuelve array', async () => {
    degustacionServiceMock.listar.mockResolvedValue([{ id: 1 }]);
    const req = mockRequest();
    const res = mockResponse();

    await controller.listar(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it('crear -> 201 y asigna galardones', async () => {
    const degustacion = { id: 1, usuario: { id: 1 }, cerveza: { id: 1 }, pais_degustacion: 'ES' } as any;
    degustacionServiceMock.crear.mockResolvedValue(degustacion);
    usuarioRepoMock.findOne.mockResolvedValue({
      degustaciones: [degustacion],
    });
    galardonServiceMock.obtenerGalardonDef.mockReturnValue({}); 
    galardonServiceMock.calcularNivel.mockReturnValue(1);

    const req = mockRequest({ body: degustacion });
    const res = mockResponse();

    await controller.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(degustacion);
  });
});
