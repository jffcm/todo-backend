const tarefaService = require('../services/tarefaService');
const ApiResponse = require('../models/ApiResponse');

exports.cadastrarTarefa = async(req, res) => {
    const { descricao, prioridade } = req.body;
    const idUsuario = req.idUsuario; 

    const erros = [];
    if (!descricao) erros.push('A descrição da tarefa é obrigatória!');
    if (!prioridade) erros.push('A prioridade da tarefa é obrigatória!');

    if (erros.length > 0) {
        return res.status(400).json(new ApiResponse(400, erros));
    }

    try {
        const tarefa = await tarefaService.cadastrarTarefa(descricao, prioridade, idUsuario);
        return res.status(tarefa.status).json(tarefa);
    } catch (error) {
        console.error('Erro no cadastrarTarefa controller:', error);
        return res.status(500).json(new ApiResponse(500, 'Erro ao cadastrar a tarefa'));
    }
};

exports.obterTarefasPendentes = async (req, res) => {
    const idUsuario = req.idUsuario;
    try {
        const tarefas = await tarefaService.obterTarefasPendentes(idUsuario);
        return res.status(tarefas.status).json(tarefas);
    } catch (error) {
        console.error('Erro no obterTarefasPendentes controller:', error);
        return res.status(500).json(new ApiResponse(500, 'Erro ao obter tarefas pendentes'));
    }
};

exports.marcarTarefaComoConcluida = async (req, res) => {
    const { id } = req.params;
    const idUsuario = req.idUsuario;

    try {
        const response = await tarefaService.marcarTarefaComoConcluida(idUsuario, id);
        return res.status(response.status).json(response);
    } catch (error) {
        console.error('Erro no marcarTarefaComoConcluida controller:', error);
        return res.status(500).json(new ApiResponse(500, 'Erro ao marcar tarefa como concluída'));
    }
};