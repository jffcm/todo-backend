const express = require('express');
const tarefaController = require('../controllers/tarefaController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/v1/tarefas:
 *   post:
 *     summary: Cadastra uma nova tarefa
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descricao:
 *                 type: string
 *                 example: "Estudar Node.js"
 *               prioridade:
 *                 type: string
 *                 enum: [Alta, Média, Baixa]
 *                 example: "Alta"
 *     responses:
 *       201:
 *         description: Tarefa cadastrada com sucesso
 *       400:
 *         description: Erro de validação
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/tarefas', authMiddleware, tarefaController.cadastrarTarefa);


/**
 * @swagger
 * /api/v1/tarefas:
 *   get:
 *     summary: Obtém as tarefas pendentes de um usuário
 *     tags: [Tarefas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas pendentes
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/tarefas', authMiddleware, tarefaController.obterTarefasPendentes);

module.exports = router;