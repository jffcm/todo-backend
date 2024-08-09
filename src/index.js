const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const usuarioRoutes = require('./routes/usuarioRoutes');
const tarefaRoutes = require('./routes/tarefaRoutes')
const db = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(cors({
    origin: '*'
  }));

app.use(express.json());
app.use('/api/v1', usuarioRoutes);
app.use('/api/v1', tarefaRoutes);

const swaggerDefinition = {
    openapi: '3.0.0',
    explorer: true,
    info: {
        title: "Todo",
        version: "1.0.0",
        description: "API para gerenciamento de tarefas"
    },
    components: {
        schemas: require('../swagger.json'),
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['src/routes/*.js']
};

const swaggerSpec = swaggerJsDoc(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;

db.connectDB();

app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
});