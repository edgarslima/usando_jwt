# Autenticação usando JWT

Exemplo simples de aplicação Node.js com Express e MongoDB demonstrando o uso de JSON Web Tokens (JWT).

## Detalhes

O projeto tem caráter didático e serve como ponto de partida para outros sistemas que necessitem de autenticação.

## Instalação
1. Tenha **Node.js** e **MongoDB** instalados e com o Mongo rodando em `mongodb://localhost/noderest`.
2. Instale as dependências do projeto:

```bash
npm install
# ou
yarn
```

3. Inicie a aplicação:

```bash
node src/index.js
```

O servidor ficará acessível na porta `3000`.

## Funcionalidades

### Cadastro
`POST /auth/register`
Cria um usuário a partir de `name`, `email` e `password`. O retorno contém o usuário cadastrado (sem a senha) e um token JWT válido por 24h.

### Autenticação
`POST /auth/authenticate`
Recebe `email` e `password`. Se as credenciais forem válidas, é gerado um token para uso nas rotas protegidas.

### Rota protegida de exemplo
`GET /testetoken`
Utilize o token no cabeçalho `Authorization: Bearer <token>` para acessar. A rota responde com o id do usuário presente no token.

### Recuperação de senha
`POST /auth/forgot_password`
Envia um token de recuperação para o e-mail informado (a implementação atual apenas imprime o token no console).

### Redefinição de senha
`POST /auth/reset_password`
Utilize `email`, `token` recebido e a nova `password` para atualizar a senha do usuário.

## Exemplo de chamada para rota protegida

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/testetoken
```

## Próximos passos
- Mapear permissões de acesso por recurso

Obs.: Este projeto é evolutivo e pode ser expandido para contemplar novas boas práticas.
