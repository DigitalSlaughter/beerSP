import { mockRequest, mockResponse } from '../utils/expressMocks';
import { SolicitudAmistadController } from '../../controllers/SolicitudAmistadController';
import { SolicitudAmistadService } from '../../services/SolicitudAmistadService';
import { Usuario } from '../../models/Usuario';
import { SolicitudAmistad } from '../../models/SolicitudAmistad';

jest.mock('../../services/SolicitudAmistadService');

const solicitudServiceMock = new SolicitudAmistadService() as jest.Mocked<SolicitudAmistadService>;
const controller = new SolicitudAmistadController(solicitudServiceMock);

describe('SolicitudAmistadController - unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listar -> devuelve array', async () => {
    const req = mockRequest({ params: { idUsuario: 1 } });
    const res = mockResponse();

    solicitudServiceMock.listarPorUsuario.mockResolvedValue([
      {
        id: 1,
        usuario1: { id: 1 } as Partial<Usuario>,
        usuario2: { id: 2 } as Partial<Usuario>
      } as SolicitudAmistad
    ]);

    await controller.listar(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { id: 1, usuario1: { id: 1 }, usuario2: { id: 2 } }
    ]);
  });

  it('crear -> 201 si todo correcto', async () => {
    const req = mockRequest({ params: { idUsuario: 1 }, body: { usuario2: 2 } });
    const res = mockResponse();

    solicitudServiceMock.existeRelacion.mockResolvedValue(null);
    solicitudServiceMock.crear.mockResolvedValue({
      id: 1,
      estado_solicitud: 'pendiente',
      usuario1: { id: 1 } as Partial<Usuario>,
      usuario2: { id: 2 } as Partial<Usuario>
    } as any);


    await controller.crear(req, res);

    expect(solicitudServiceMock.crear).toHaveBeenCalledWith({
      usuario1: { id: 1 },
      usuario2: { id: 2 }
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ estado_solicitud: 'pendiente' }));
  });
});
