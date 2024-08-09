const request = require('supertest');
const express = require('express');
const tarefaRoutes = require('../../routes/tarefaRoutes');
const tarefaService = require('../../services/tarefaService');
const authMiddleware = require('../../middlewares/authMiddleware');
const ApiResponse = require('../../models/ApiResponse');

jest.mock('../../services/tarefaService');
jest.mock('../../middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/v1', tarefaRoutes);

describe('tarefaController', () => {
    beforeEach(() => {
        authMiddleware.mockImplementation((req, _, next) => {
            req.idUsuario = 1;
            next();
        });
    });

    describe('POST /api/v1/tarefas', () => {
        it('deve retornar 400 se os campos obrigatórios não forem fornecidos', async () => {
            const res = await request(app)
                .post('/api/v1/tarefas')
                .send({ descricao: '', prioridade: '' });

            expect(res.status).toBe(400);
            expect(res.body.status).toBe(400);
            expect(res.body.message).toContain('A descrição da tarefa é obrigatória!');
            expect(res.body.message).toContain('A prioridade da tarefa é obrigatória!');
        });

        it('deve retornar 201 se a tarefa for cadastrada com sucesso', async () => {
            tarefaService.cadastrarTarefa.mockResolvedValue(new ApiResponse(201, 'Tarefa cadastrada com sucesso!', { descricao: 'Teste', prioridade: 'Alta' }));

            const res = await request(app)
                .post('/api/v1/tarefas')
                .send({ descricao: 'Teste', prioridade: 'Alta' });

            expect(res.status).toBe(201);
            expect(res.body.status).toBe(201);
            expect(res.body.message).toBe('Tarefa cadastrada com sucesso!');
        });

        it('deve retornar 500 se ocorrer um erro no serviço', async () => {
            tarefaService.cadastrarTarefa.mockImplementation(() => {
                throw new Error('Erro ao cadastrar a tarefa');
            });

            const res = await request(app)
                .post('/api/v1/tarefas')
                .send({ descricao: 'Teste', prioridade: 'Alta' });

            expect(res.status).toBe(500);
            expect(res.body.status).toBe(500);
            expect(res.body.message).toBe('Erro ao cadastrar a tarefa');
        });
    });

    describe('GET /api/v1/tarefas', () => {
        it('deve retornar 200 se as tarefas pendentes forem obtidas com sucesso', async () => {
            tarefaService.obterTarefasPendentes.mockResolvedValue(new ApiResponse(200, 'Tarefas pendentes obtidas com sucesso', [{ descricao: 'Teste', prioridade: 'Alta', completada: false }]));

            const res = await request(app)
                .get('/api/v1/tarefas');

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(200);
            expect(res.body.message).toBe('Tarefas pendentes obtidas com sucesso');
            expect(res.body.data.length).toBe(1);
        });

        it('deve retornar 500 se ocorrer um erro no serviço', async () => {
            tarefaService.obterTarefasPendentes.mockImplementation(() => {
                throw new Error('Erro ao obter tarefas pendentes');
            });

            const res = await request(app)
                .get('/api/v1/tarefas');

            expect(res.status).toBe(500);
            expect(res.body.status).toBe(500);
            expect(res.body.message).toBe('Erro ao obter tarefas pendentes');
        });
    });

    describe('PUT /api/v1/tarefas/:id/concluir', () => {
        it('deve retornar 200 se a tarefa for marcada como concluída com sucesso', async () => {
            tarefaService.marcarTarefaComoConcluida.mockResolvedValue(new ApiResponse(200, 'Tarefa marcada como concluída com sucesso', { descricao: 'Teste', prioridade: 'Alta', completada: true }));

            const res = await request(app)
                .put('/api/v1/tarefas/1/concluir');

            expect(res.status).toBe(200);
            expect(res.body.status).toBe(200);
            expect(res.body.message).toBe('Tarefa marcada como concluída com sucesso');
            expect(res.body.data.completada).toBe(true);
        });

        it('deve retornar 404 se a tarefa não for encontrada', async () => {
            tarefaService.marcarTarefaComoConcluida.mockResolvedValue(new ApiResponse(404, 'Tarefa não encontrada ou não pertence ao usuário', null));

            const res = await request(app)
                .put('/api/v1/tarefas/1/concluir');

            expect(res.status).toBe(404);
            expect(res.body.status).toBe(404);
            expect(res.body.message).toBe('Tarefa não encontrada ou não pertence ao usuário');
        });

        it('deve retornar 500 se ocorrer um erro no serviço', async () => {
            tarefaService.marcarTarefaComoConcluida.mockImplementation(() => {
                throw new Error('Erro ao marcar tarefa como concluída');
            });

            const res = await request(app)
                .put('/api/v1/tarefas/1/concluir');

            expect(res.status).toBe(500);
            expect(res.body.status).toBe(500);
            expect(res.body.message).toBe('Erro ao marcar tarefa como concluída');
        });
    });
});
