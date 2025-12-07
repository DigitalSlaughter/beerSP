import { mockRequest, mockResponse } from '../utils/expressMocks';
import { CervezaController } from '../../controllers/CervezaController';
import { CervezaService } from '../../services/CervezaService';

jest.mock('../../services/CervezaService');

const cervezaServiceMock = new CervezaService() as jest.Mocked<CervezaService>;
const controller = new CervezaController();

describe('CervezaController - unit', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crear -> 201 si todo correcto', async () => {
    const req = mockRequest({ body: { nombre: 'IPA', amargor: 0, porcentaje_alcohol: 0 } });
    const res = mockResponse();
    const cerveza = { id: 1, nombre: 'IPA', amargor: 0, porcentaje_alcohol: 0 };

    cervezaServiceMock.crear.mockResolvedValue(cerveza);

    await controller.crear(req, res);

    expect(cervezaServiceMock.crear).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(cerveza);
  });

  it('crear -> 400 si hay error', async () => {
    const req = mockRequest({ body: { nombre: 'IPA' } });
    const res = mockResponse();

    cervezaServiceMock.crear.mockRejectedValue(new Error('Error al crear cerveza'));

    await controller.crear(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ mensaje: 'Error al crear cerveza' }));
  });
});
