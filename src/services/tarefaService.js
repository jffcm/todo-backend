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
    }
};

module.exports = tarefaService;