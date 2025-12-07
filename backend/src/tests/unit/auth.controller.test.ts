// src/tests/unit/auth.controller.test.ts
import { mockRequest, mockResponse } from '../utils/expressMocks';

const authServiceMock = {
  login: jest.fn(),
};

jest.mock('../../services/AuthService', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => authServiceMock),
  };
});

import { AuthController } from '../../controllers/AuthController';

describe('AuthController - unit', () => {
  let controller: typeof AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = AuthController;
  });

  it('login -> 200 si credenciales correctas', async () => {
    const user = { id: 1, correo: 'test@example.com' };
    authServiceMock.login.mockResolvedValue(user);

    const req = mockRequest({ body: { email: 'test@example.com', password: '123456' } });
    const res = mockResponse();

    await controller.login(req, res);

    expect(authServiceMock.login).toHaveBeenCalledWith('test@example.com', '123456');
    expect(res.status).not.toHaveBeenCalled(); // status solo se llama en error
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('login -> 400 si credenciales incorrectas', async () => {
    authServiceMock.login.mockRejectedValue(new Error('Usuario no encontrado'));

    const req = mockRequest({ body: { email: 'noexiste@example.com', password: '123456' } });
    const res = mockResponse();

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Usuario no encontrado' }));
  });
});
