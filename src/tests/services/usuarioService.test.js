const Usuario = require('../../models/Usuario');
const ApiResponse = require('../../models/ApiResponse');
const usuarioService = require('../../services/usuarioService');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('usuarioService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('cadastrarUsuario', () => {
        it('deve retornar 422 se o usuário já existir', async () => {
            await Usuario.create({ nome: 'Teste', email: 'test@example.com', senha: 'senha123' });

            const response = await usuarioService.cadastrarUsuario('Teste', 'test@example.com', 'senha123');

            expect(response).toEqual(new ApiResponse(422, 'Este endereço de e-mail já está cadastrado', null));
        });

        it('deve retornar 201 e cadastrar o usuário com sucesso', async () => {
            const response = await usuarioService.cadastrarUsuario('Teste', 'test@example.com', 'senha123');

            expect(response).toEqual(expect.objectContaining({
                status: 201,
                message: 'Usuário cadastrado com sucesso!',
                data: expect.objectContaining({
                    nome: 'Teste',
                    email: 'test@example.com',
                }),
            }));
        });

        it('deve lançar um erro se ocorrer um problema', async () => {
            jest.spyOn(Usuario, 'findOne').mockRejectedValue(new Error('Erro ao buscar usuário'));

            await expect(usuarioService.cadastrarUsuario('Teste', 'test@example.com', 'senha123')).rejects.toThrow('Erro ao cadastrar o usuário');
        });
    });

    describe('login', () => {
        it('deve retornar 404 se o usuário não for encontrado', async () => {
            Usuario.findOne.mockResolvedValue(null);

            const response = await usuarioService.login('test@example.com', 'senha123');

            expect(response).toEqual(new ApiResponse(404, 'Usuário não encontrado!', null));
        });

        it('deve retornar 422 se a senha for inválida', async () => {
            const usuario = await Usuario.create({ nome: 'Teste', email: 'test@example.com', senha: 'senha123' });
            usuario.comparePassword = jest.fn().mockResolvedValue(false);

            Usuario.findOne.mockResolvedValue(usuario); 

            const response = await usuarioService.login('test@example.com', 'senha123');

            expect(response).toEqual(new ApiResponse(422, 'Senha Inválida', null));
        });

        it('deve retornar 200 e um token se o login for bem-sucedido', async () => {
            const usuario = await Usuario.create({ nome: 'Teste', email: 'test@example.com', senha: 'senha123' });
            usuario.comparePassword = jest.fn().mockResolvedValue(true);
            Usuario.findOne.mockResolvedValue(usuario); 

            jwt.sign.mockReturnValue('mocked-token');

            const response = await usuarioService.login('test@example.com', 'senha123');

            expect(response).toEqual(new ApiResponse(200, 'Autenticação bem-sucedida!', { token: 'mocked-token' }));
        });

        it('deve lançar um erro se ocorrer um problema', async () => {
            jest.spyOn(Usuario, 'findOne').mockRejectedValue(new Error('Erro ao buscar usuário'));

            await expect(usuarioService.login('test@example.com', 'senha123')).rejects.toThrow('Erro ao tentar autenticar o usuário');
        });
    });
});
