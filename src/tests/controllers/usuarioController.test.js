const request = require('supertest');
const express = require('express');
const usuarioRoutes = require('../../routes/usuarioRoutes');
const usuarioService = require('../../services/usuarioService');
const ApiResponse = require('../../models/ApiResponse');

jest.mock('../../services/usuarioService');

const app = express();
app.use(express.json());
app.use('/api/v1', usuarioRoutes);

describe('usuarioController', () => {
    describe('POST /api/v1/usuarios', () => {
        it('deve retornar 400 se os campos obrigatórios não forem fornecidos', async () => {
            const res = await request(app)
                .post('/api/v1/usuarios')
                .send({ nome: '', email: '', senha: '' });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(400);
            expect(res.body.message).toContain('O nome é obrigatório!');
            expect(res.body.message).toContain('O e-mail é obrigatório!');
            expect(res.body.message).toContain('A senha é obrigatória!');
        });

        it('deve retornar 201 se o usuário for cadastrado com sucesso', async () => {
            usuarioService.cadastrarUsuario.mockResolvedValue(new ApiResponse(201, 'Usuário cadastrado com sucesso!', { nome: 'João Silva', email: 'joao.silva@example.com' }));

            const res = await request(app)
                .post('/api/v1/usuarios')
                .send({ nome: 'João Silva', email: 'joao.silva@example.com', senha: 'senha123' });

            expect(res.status).toBe(201);
            expect(res.body.status).toBe(201);
            expect(res.body.message).toBe('Usuário cadastrado com sucesso!');
        });

        it('deve retornar 500 se ocorrer um erro no serviço', async () => {
            usuarioService.cadastrarUsuario.mockImplementation(() => {
                throw new Error('Erro ao cadastrar o usuário');
            });

            const res = await request(app)
                .post('/api/v1/usuarios')
                .send({ nome: 'João Silva', email: 'joao.silva@example.com', senha: 'senha123' });

            expect(res.status).toBe(500);
            expect(res.body.status).toBe(500);
            expect(res.body.message).toBe('Erro ao cadastrar o usuário');
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('deve retornar 400 se os campos obrigatórios não forem fornecidos', async () => {
            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: '', senha: '' });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(400);
            expect(res.body.message).toContain('O e-mail é obrigatório!');
            expect(res.body.message).toContain('A senha é obrigatória!');
        });

        it('deve retornar 200 se o login for bem-sucedido', async () => {
            usuarioService.login.mockResolvedValue(new ApiResponse(200, 'Autenticação bem-sucedida!', { token: 'mocked-token' }));

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'joao.silva@example.com', senha: 'senha123' });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(200);
            expect(res.body.message).toBe('Autenticação bem-sucedida!');
            expect(res.body.data.token).toBe('mocked-token');
        });

        it('deve retornar 500 se ocorrer um erro no serviço', async () => {
            usuarioService.login.mockImplementation(() => {
                throw new Error('Erro ao tentar autenticar o usuário');
            });

            const res = await request(app)
                .post('/api/v1/auth/login')
                .send({ email: 'joao.silva@example.com', senha: 'senha123' });

            expect(res.status).toBe(500);
            expect(res.body.status).toBe(500);
            expect(res.body.message).toBe('Erro ao tentar autenticar o usuário');
        });
    });
});
