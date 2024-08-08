# TODO Application

Este é um aplicativo de tarefas (TO-DO) construído com Node.js, Express, MongoDB e Mongoose.

## Requisitos

- Node.js
- Docker (para rodar o MongoDB)

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/jffcm/todo-backend.git
    cd todo-backend
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

    ```env
    PORT=3000
    JWT_SECRET=sua_chave_secreta
    MONGO_URI=mongodb://username:password@host:port/todo
    ```

4. Crie um arquivo `config.env` na raiz do projeto e adicione as seguintes variáveis de ambiente para configurar o MongoDB:

    ```env
    MONGO_INITDB_ROOT_USERNAME=seu_usuario
    MONGO_INITDB_ROOT_PASSWORD=sua_senha
    ```

5. Suba o container do MongoDB utilizando o Docker Compose:

    ```bash
    docker-compose up
    ```

## Executando a Aplicação

    ```bash
    npm start
    ```
