const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    nome: { 
        type: String, 
        required: true
    },
    email: { 
        type: String, 
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 'Informe um e-mai válido! Ex: teste@teste.com'],
        required: true,
        unique: true 
    },
    senha: { 
        type: String, 
        required: true
    },
});
usuarioSchema.plugin(AutoIncrement);

const SALT_ROUNDS = 10;

usuarioSchema.pre('save', async function(next) {
    if (this.isModified('senha')) {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(this.senha, salt);
        this.senha = hashedPassword;
    }
    next();
});

usuarioSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.senha);
}

usuarioSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.senha;
    return obj;
};

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;