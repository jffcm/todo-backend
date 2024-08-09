const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middlewares/authMiddleware');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(() => res)
        };
        next = jest.fn();
    });

    it('deve retornar 401 se o token não for fornecido', () => {
        req.header.mockReturnValue(null);

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Autenticação necessária' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se o token for inválido', () => {
        req.header.mockReturnValue('Bearer token-invalido');
        jwt.verify.mockImplementation(() => {
            throw new Error('Token inválido');
        });

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido' });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve chamar next se o token for válido', () => {
        req.header.mockReturnValue('Bearer token-valido');
        jwt.verify.mockReturnValue({ id: 1 });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('token-valido', process.env.JWT_SECRET);
        expect(req.idUsuario).toBe(1);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});
