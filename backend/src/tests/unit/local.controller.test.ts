// src/tests/unit/local.controller.test.ts
import { mockRequest, mockResponse } from '../utils/expressMocks';

const localServiceMock = {
  listar: jest.fn(),
  crear: jest.fn(),
  obtener: jest.fn(),
};

jest.mock('../../services/LocalService', () => {
  return { LocalService: jest.fn().mockImplementation(() => localServiceMock) };
});

import { LocalController } from '../../controllers/LocalController';

describe('LocalController - unit', () => {
  let controller: LocalController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new LocalController();
  });

  it('listar -> devuelve array', async () => {
    localServiceMock.listar.mockResolvedValue([{ id: 1, nombre: 'Local1' }]);
    const req = mockRequest();
    const res = mockResponse();

    await controller.listar(req, res);

    expect(res.json).toHaveBeenCalledWith([{ id: 1, nombre: 'Local1' }]);
  });

  it('crear -> 201 si todo correcto', async () => {
    const local = { id: 1, nombre: 'Local1' };
    localServiceMock.crear.mockResolvedValue(local);

    const req = mockRequest({ body: { nombre: 'Local1' } });
    const res = mockResponse();

    await controller.crear(req, res);

    expect(localServiceMock.crear).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(local);
  });

  it('crear -> 400 si hay error', async () => {
    localServiceMock.crear.mockRejectedValue(new Error('Error al crear local'));

    const req = mockRequest({ body: { nombre: '' } });
    const res = mockResponse();

    await controller.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: 'Error al crear local' }));
  });
});
