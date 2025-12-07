import { mockRequest, mockResponse } from '../utils/expressMocks';
import { SolicitudAmistadController } from '../../controllers/SolicitudAmistadController';
import { SolicitudAmistadService } from '../../services/SolicitudAmistadService';

jest.mock('../../services/SolicitudAmistadService');

const solicitudServiceMock = new SolicitudAmistadService() as jest.Mocked<SolicitudAmistadService>;
const controller = new SolicitudAmistadController();

describe('SolicitudAmistadController - unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listar -> devuelve array', async () => {
    const req = mockRequest({ params: { idUsuario: 1 } });
    const res = mockResponse();

    solicitudServiceMock.listarPorUsuario.mockResolvedValue([
      { id: 1, usuario1: { id: 1, foto: null }, usuario2: { id: 2, foto: null } }
    ]);

    await controller.listar(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { id: 1, usuario1: { id: 1, foto: null }, usuario2: { id: 2, foto: null } }
    ]);
  });

  it('crear -> 201 si todo correcto', async () => {
    const req = mockRequest({ params: { idUsuario: 1 }, body: { usuario2: 2 } });
    const res = mockResponse();

    solicitudServiceMock.existeRelacion.mockResolvedValue(false);
    solicitudServiceMock.crear.mockResolvedValue({
      id: 1,
      estado_solicitud: 'pendiente',
      usuario1: { id: 1 },
      usuario2: { id: 2 }
    });

    await controller.crear(req, res);

    expect(solicitudServiceMock.crear).toHaveBeenCalledWith({
      usuario1: { id: 1 },
      usuario2: { id: 2 }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ estado_solicitud: 'pendiente' }));
  });
});
