const usuarioService = require('../services/usuarioService');
const ApiResponse = require('../models/ApiResponse');

exports.cadastrarUsuario = async(req, res) => {
    const { nome, email, senha } = req.body;

    const erros = [];
    if (!nome) erros.push('O nome é obrigatório!');
    if (!email) erros.push('O e-mail é obrigatório!');
    if (!senha) erros.push('A senha é obrigatória!');

    if (erros.length > 0) {
        return res.status(400).json(new ApiResponse(400, erros));
    }

    try {
        const usuario = await usuarioService.cadastrarUsuario(nome, email, senha);
        return res.status(usuario.status).json(usuario);
    } catch (error) {
        console.error('Erro no cadastrarUsuario controller:', error);
        return res.status(500).json(new ApiResponse(500, 'Erro ao cadastrar o usuário'));
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    const erros = [];
    if (!email) erros.push('O e-mail é obrigatório!');
    if (!senha) erros.push('A senha é obrigatória!');

    if (erros.length > 0) {
        return res.status(400).json(new ApiResponse(400, erros));
    }

    try {
        const usuario = await usuarioService.login(email, senha);
        return res.status(usuario.status).json(usuario);
    } catch (error) {
        console.error('Error no login controller:', error);
        return res.status(500).json(new ApiResponse(500, 'Erro ao tentar autenticar o usuário'));
    }
};
