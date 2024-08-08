const mongoose = require('mongoose');

exports.connectDB = async() => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error('A URI de conexão com o MongoDB não foi fornecida!');
        }

        await mongoose.connect(uri);
        
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error(`Erro ao conectar ao MongoDB na URI ${process.env.MONGO_URI}:`, error);
    }
}
