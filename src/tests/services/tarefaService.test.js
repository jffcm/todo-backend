const Tarefa = require('../../models/Tarefa');
const ApiResponse = require('../../models/ApiResponse');
const tarefaService = require('../../services/tarefaService');
const mongoose = require('mongoose');

describe('tarefaService', () => {
    afterEach(async () => {
        jest.clearAllMocks();
    });

    describe('cadastrarTarefa', () => {
        it('deve retornar 201 e cadastrar a tarefa com sucesso', async () => {
            const response = await tarefaService.cadastrarTarefa('Teste', 'Alta', 1);

            expect(response.status).toBe(201);
            expect(response.message).toBe('Tarefa cadastrado com sucesso!');
            expect(response.data).toMatchObject({
                descricao: 'Teste',
                prioridade: 'Alta',
                idUsuario: 1,
                completada: false
            });

            const tarefaNoBanco = await Tarefa.findOne({ descricao: 'Teste' });
            expect(tarefaNoBanco).not.toBeNull();
            expect(tarefaNoBanco.descricao).toBe('Teste');
        });

        it('deve lançar um erro se ocorrer um problema', async () => {
            const mockSave = jest.spyOn(Tarefa.prototype, 'save').mockImplementationOnce(() => {
                throw new Error('Erro ao salvar tarefa');
            });

            await expect(tarefaService.cadastrarTarefa('Teste', 'Alta', 1)).rejects.toThrow('Erro ao cadastrar a tarefa');
            mockSave.mockRestore();
        });
    });

    describe('obterTarefasPendentes', () => {
        it('deve retornar 200 e obter tarefas pendentes com sucesso', async () => {
            await Tarefa.create({ descricao: 'Teste', prioridade: 'Alta', idUsuario: 1 });

            const response = await tarefaService.obterTarefasPendentes(1);

            expect(response.status).toBe(200);
            expect(response.message).toBe('Tarefas pendentes obtidas com sucesso');
            expect(response.data.length).toBe(1);
            expect(response.data[0]).toMatchObject({
                descricao: 'Teste',
                prioridade: 'Alta',
                idUsuario: 1,
                completada: false
            });
        });

        it('deve lançar um erro se ocorrer um problema', async () => {
            jest.spyOn(Tarefa, 'find').mockImplementationOnce(() => {
                throw new Error('Erro ao buscar tarefas');
            });

            await expect(tarefaService.obterTarefasPendentes(1)).rejects.toThrow('Erro ao obter tarefas pendentes');
        });
    });

    describe('marcarTarefaComoConcluida', () => {
        it('deve retornar 200 e marcar tarefa como concluída com sucesso', async () => {
            const tarefa = await Tarefa.create({ descricao: 'Teste', prioridade: 'Alta', idUsuario: 1 });

            const response = await tarefaService.marcarTarefaComoConcluida(1, tarefa._id);

            expect(response.status).toBe(200);
            expect(response.message).toBe('Tarefa marcada como concluída com sucesso');
            expect(response.data.completada).toBe(true);

            const tarefaAtualizada = await Tarefa.findById(tarefa._id);
            expect(tarefaAtualizada.completada).toBe(true);
        });

        it('deve retornar 404 se a tarefa não for encontrada', async () => {
            const response = await tarefaService.marcarTarefaComoConcluida(1, 999);

            expect(response.status).toBe(404);
            expect(response.message).toBe('Tarefa não encontrada ou não pertence ao usuário');
        });

        it('deve lançar um erro se ocorrer um problema', async () => {
            jest.spyOn(Tarefa, 'findOneAndUpdate').mockImplementationOnce(() => {
                throw new Error('Erro ao atualizar tarefa');
            });

            await expect(tarefaService.marcarTarefaComoConcluida(1, 999)).rejects.toThrow('Erro ao marcar tarefa como concluída');
        });
    });
});
