# Fastify REST API

API REST completa com Node.js, Fastify, TypeScript, Knex.js e suporte para SQLite (dev) e PostgreSQL (prod).

## RF (Requisitos Funcionais)

- [x] O usuário deve poder criar uma nova transação
- [x] O usuário de poder um resumo da sua conta
- [x] O usuário deve poder listar todas as transações que já ocorreram
- [x] O usuário deve poder visualizar uma transação única

## RN (Regras de Negócio)

- [x] A transação pode ser do tipo crédito que somará ao valor total, ou débito que subtrairá
- [x] Deve ser possível identificarmos o usuário entre as requisições
- [x] O usuário só pode visualizar transações o qual ele criou

## Instalação

```bash
npm install
```

## Configuração

### Desenvolvimento (SQLite)

Crie um arquivo `.env` com:

```
NODE_ENV=development
DATABASE_CLIENT=sqlite
DATABASE_URL=./db/app.db
PORT=3333
```

### Produção (PostgreSQL)

Configure as variáveis de ambiente:

```
NODE_ENV=production
DATABASE_CLIENT=pg
DATABASE_URL=postgresql://user:password@host:port/database
PORT=3333
```

## Executar Migrações

```bash
npm run knex -- migrate:latest
```

## Desenvolvimento

```bash
npm run dev
```

## Testes

```bash
npm test
```

## Deploy no Render

### 1. Criar PostgreSQL Database

No Render Dashboard:

- Clique em **New +** → **PostgreSQL**
- Escolha um nome e região
- Após criado, copie a **External Database URL**

### 2. Configurar Web Service

No Render Dashboard:

- Clique em **New +** → **Web Service**
- Conecte seu repositório GitHub
- Configure:
  - **Build Command**: `npm install && npm run knex -- migrate:latest && npm run build`
  - **Start Command**: `node build/server.js`

### 3. Adicionar Variáveis de Ambiente

Na aba **Environment** do seu Web Service, adicione:

```
NODE_ENV=production
DATABASE_CLIENT=pg
DATABASE_URL=<cole-a-url-do-postgresql-aqui>
PORT=3333
```

### 4. Deploy

O Render fará o deploy automaticamente. Os logs mostrarão o progresso.

## Endpoints

### POST `/transactions`

Criar transação

```json
{
  "title": "Freelance",
  "amount": 5000,
  "type": "credit"
}
```

### GET `/transactions`

Listar todas as transações do usuário

### GET `/transactions/:id`

Buscar transação específica

### GET `/transactions/summary`

Obter resumo da conta
