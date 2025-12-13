import { mockRequest, mockResponse } from '../utils/expressMocks';
import { UsuarioController } from '../../controllers/UsuarioController';
import { UsuarioService } from '../../services/UsuarioService';
import { GalardonService } from '../../services/GalardonService';
import { UsuarioRepository } from '../../repositories/UsuarioRepository';
import { Usuario } from '../../models/Usuario';

jest.mock('../../services/UsuarioService');
jest.mock('../../services/GalardonService');
jest.mock('../../repositories/UsuarioRepository');

const usuarioServiceMock = new UsuarioService() as jest.Mocked<UsuarioService>;
const galardonServiceMock = new GalardonService() as jest.Mocked<GalardonService>;
const usuarioRepoMock = UsuarioRepository as jest.Mocked<typeof UsuarioRepository>;
const controller = new UsuarioController(usuarioServiceMock,galardonServiceMock);

describe('UsuarioController - unit', () => {
  beforeEach(() => jest.clearAllMocks());

  it('crearUsuario -> 201 si todo correcto', async () => {
    const req = mockRequest({ body: { nombre_usuario: 'nuevo', correo: 'a@b.com', password: '123' } });
    const res = mockResponse();
    const usuario = {
      id: 1,
      nombre_usuario: 'nuevo',
      correo: 'a@b.com',
      galardonesAsignados: []
    } as Partial<Usuario>;

    usuarioServiceMock.crearUsuario.mockResolvedValue(usuario as Usuario);
    galardonServiceMock.asignarGalardonEvento.mockResolvedValue(undefined);
    usuarioRepoMock.findOne.mockResolvedValue(usuario as Usuario);

    await controller.crearUsuario(req, res);

    expect(usuarioServiceMock.crearUsuario).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(usuario);
  });
});
