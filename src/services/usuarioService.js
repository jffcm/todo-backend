const Usuario = require('../models/Usuario');
const ApiResponse = require('../models/ApiResponse');
const jwt = require('jsonwebtoken');

const usuarioService = {
    async cadastrarUsuario(nome, email, senha) {
        try {
            const usuarioExiste = await Usuario.findOne({ email });
            if (usuarioExiste) {
                return new ApiResponse(422, 'Este endereço de e-mail já está cadastrado', null);
            }

            const usuario = new Usuario({ nome, email, senha });
            await usuario.save();
            return new ApiResponse(201, 'Usuário cadastrado com sucesso!', usuario);
        } catch (error) {
            console.error('Erro no usuarioService.cadastrarUsuario:', error);
            throw new Error('Erro ao cadastrar o usuário');
        }
    },

    async login(email, senha) {
        try {
            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return new ApiResponse(404, 'Usuário não encontrado!', null);
            }

            const isPasswordValid = await usuario.comparePassword(senha);
            if (!isPasswordValid) {
                return new ApiResponse(422, 'Senha Inválida', null);
            }

            const jwtSecret = process.env.JWT_SECRET;
            const token = jwt.sign({ id: usuario._id }, jwtSecret, { expiresIn: '1h' });
            
            console.log(usuario._id);

            return new ApiResponse(200, 'Autenticação bem-sucedida!', { token });
        } catch (error) {
            console.error('Error no userService.login:', error);
            throw new Error('Erro ao tentar autenticar o usuário');
        }
    },
};

module.exports = usuarioService;