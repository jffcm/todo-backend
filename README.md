# TODO Application

Este é um aplicativo de tarefas (TO-DO) construído com Node.js, Express, MongoDB e Mongoose.

## Requisitos

- Node.js
- Docker (para rodar o MongoDB)

## Instalação

### 1. Clone o repositório:

```bash
git clone https://github.com/jffcm/todo-backend.git
cd todo-backend
```

### 2. Instale as dependências:

```bash
npm install
```

### 3. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta
MONGO_URI=mongodb://username:password@host:port/todo
```

### 4. Crie um arquivo `config.env` na raiz do projeto e adicione as seguintes variáveis de ambiente para configurar o MongoDB:

```env
MONGO_INITDB_ROOT_USERNAME=seu_usuario
MONGO_INITDB_ROOT_PASSWORD=sua_senha
```

### 5. Suba o container do MongoDB utilizando o Docker Compose:

```bash
docker-compose up
```

## Executando a Aplicação

```bash
`npm start`
```

## Documentação da API

A documentação da API é gerada automaticamente pelo Swagger. Você pode acessá-la em:

`http://localhost:3000/api-docs`

![Swagger API Documentation](./images/swagger-screenshot1.png)

## Build e Deploy

Para preparar a aplicação para produção, siga os passos abaixo:

### 1. Criar uma versão otimizada para produção

Execute o comando abaixo para construir a aplicação:

```bash
`npm run build`
```

### 2. Fazer o deploy da aplicação

Você pode fazer o deploy da aplicação em diversos serviços de cloud ou plataformas, como Heroku, AWS ou Azure. A configuração do ambiente pode variar conforme o serviço escolhido. Certifique-se de definir as variáveis de ambiente apropriadas para o ambiente de produção.
