# API_FINANCAS
API de Gerenciamento Financeiro

Este projeto é uma API desenvolvida em Node.js com Express.js e MongoDB, permitindo o gerenciamento de usuários, transações financeiras e categorias, além da geração de relatórios financeiros.

--- Funcionalidades

1. Usuários

POST /register - Registra um novo usuário.

POST /login - Realiza autenticação e retorna um token JWT.

GET /profile - Retorna informações do usuário autenticado.

2. Transações

GET /transactions - Retorna todas as transações do usuário autenticado.

POST /transactions - Cria uma nova transação financeira.

PUT /transactions/{id} - Atualiza uma transação existente.

DELETE /transactions/{id} - Remove uma transação.

3. Categorias

GET /categories - Lista todas as categorias.

POST /categories - Adiciona uma nova categoria.

DELETE /categories/{id} - Remove uma categoria (se não estiver vinculada a nenhuma transação).

4. Relatórios

GET /reports/monthly - Retorna um resumo financeiro do mês atual (total de receitas, despesas e saldo).

GET /reports/custom?start={data}&end={data} - Retorna um relatório financeiro entre as datas especificadas.

5. Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. Os seguintes endpoints requerem que o usuário esteja autenticado:

GET /profile

GET /transactions

POST /transactions

PUT /transactions/{id}

DELETE /transactions/{id}

O usuário pode obter um token JWT ao fazer login através do endpoint POST /login.

--- Tecnologias Utilizadas

Node.js

Express.js

MongoDB (Mongoose para modelagem)

JSON Web Token (JWT) para autenticação

BCrypt.js para hash de senhas

--- Instalação

Clone o repositório:

git clone https://github.com/yjoaoo/API_FINANCAS.git

Acesse a pasta do projeto:

cd API_FINANCAS

Instale as dependências:

npm install

Crie um arquivo .env e configure as variáveis:

MONGO_URI=sua-string-de-conexao-mongodb
JWT_SECRET=sua-chave-secreta-jwt

Inicie o servidor:

npm start

--- Uso

Após iniciar o servidor, a API estará disponível em http://localhost:3000. Você pode utilizar ferramentas como Postman ou Insomnia para testar os endpoints.

--- Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

Feito com por João Pedro 