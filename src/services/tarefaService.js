const Tarefa = require('../models/Tarefa');
const ApiResponse = require('../models/ApiResponse');

const tarefaService = {
    async cadastrarTarefa(descricao, prioridade, idUsuario) {
        try {
            const tarefa = new Tarefa({ descricao, prioridade, idUsuario: idUsuario });
            await tarefa.save();
            return new ApiResponse(201, 'Tarefa cadastrado com sucesso!', tarefa);
        } catch (error) {
            console.error('Erro no tarefaService.cadastrarTarefa:', error.message);
            throw new Error('Erro ao cadastrar a tarefa');
        }
    },

    async obterTarefasPendentes(idUsuario) {
        try {
            const tarefasPendentes = await Tarefa.find({ idUsuario, completada: false });
            return new ApiResponse(200, 'Tarefas pendentes obtidas com sucesso', tarefasPendentes);
        } catch (error) {
            console.error('Erro no tarefaService.obterTarefasPendentes:', error.message);
            throw new Error('Erro ao obter tarefas pendentes');
        }
    },

    async marcarTarefaComoConcluida(idUsuario, idTarefa) {
        try {
            const tarefa = await Tarefa.findOneAndUpdate(
                { _id: idTarefa, idUsuario },
                { completada: true },
                { new: true }
            );
            if (!tarefa) {
                return new ApiResponse(404, 'Tarefa não encontrada ou não pertence ao usuário', null);
            }
            return new ApiResponse(200, 'Tarefa marcada como concluída com sucesso', tarefa);
        } catch (error) {
            console.error('Erro no tarefaService.marcarTarefaComoConcluida:', error.message);
            throw new Error('Erro ao marcar tarefa como concluída');
        }
    }
};

module.exports = tarefaService;