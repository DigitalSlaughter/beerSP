// src/tests/unit/comentario.controller.test.ts
import { mockRequest, mockResponse } from '../utils/expressMocks';

const comentarioServiceMock = {
  crear: jest.fn(),
  listarPorDegustacion: jest.fn(),
};

jest.mock('../../services/ComentarioDegustacionService', () => {
  return {
    ComentarioDegustacionService: jest.fn().mockImplementation(() => comentarioServiceMock),
  };
});

import { DegustacionController } from '../../controllers/DegustacionController';

describe('ComentariosDegustacion - unit', () => {
  let controller: DegustacionController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new DegustacionController();
  });

  it('crearComentario -> 201 si degustación existe', async () => {
    const comentario = { id: 1, texto: 'Muy bueno' };
    comentarioServiceMock.crear.mockResolvedValue(comentario);

    const req = mockRequest({
      params: { idDegustacion: '1' },
      body: { usuarioId: 1, texto: 'Muy bueno' },
    });
    const res = mockResponse();

    await controller.crearComentario(req, res);

    expect(comentarioServiceMock.crear).toHaveBeenCalledWith({
      degustacionId: 1,
      usuarioId: 1,
      texto: 'Muy bueno',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
  });

  it('crearComentario -> 400 si servicio lanza error', async () => {
    comentarioServiceMock.crear.mockRejectedValue(new Error('Degustación no encontrada'));

    const req = mockRequest({
      params: { idDegustacion: '999' },
      body: { usuarioId: 1, texto: 'Muy bueno' },
    });
    const res = mockResponse();

    await controller.crearComentario(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: 'Degustación no encontrada' }));
  });
});
