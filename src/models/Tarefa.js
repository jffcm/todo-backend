const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const tarefaSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    descricao: {
        type: String, 
        required: true
    },
    prioridade: { 
        type: String, 
        enum: ['Alta', 'Média', 'Baixa'],
        required: true
    },
    idUsuario: { 
        type: Number, 
        ref: 'Usuario', 
        required: true 
    },
    completada: {
        type: Boolean,
        default: false
    }
});
tarefaSchema.plugin(AutoIncrement, { id: 'tarefa_seq', inc_field: '_id' });

const Tarefa = mongoose.model('Tarefa', tarefaSchema);
module.exports = Tarefa;