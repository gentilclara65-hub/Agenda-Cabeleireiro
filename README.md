# agenda-cabeleireiro-crud

Aplicacao web com API REST para controle de agendamentos de atendimento profissional em um salao de cabeleireiro.

## Descricao

O sistema permite cadastrar, listar, editar, excluir, registrar realizacao do atendimento e registrar cancelamento de agendamentos.

O frontend foi feito com HTML, CSS e JavaScript puro. O backend foi feito com Node.js, Express, Knex, dotenv e MySQL.

## Tema escolhido

Controle de Agendamento de Atendimento Profissional - Cabeleireiro.

## Requisitos atendidos

- CRUD completo da tabela `Agendamentos`
- API REST em JavaScript com Node.js e Express
- Uso de `dotenv`, `knex`, `mysql2` e MySQL
- Frontend em HTML, CSS e JavaScript puro
- Servico de frontend entregue pela pasta `público`
- Migration e seed com dados de exemplo
- Documentacao completa em `documentos`
- Script SQL completo em `banco-de-dados/database-agenda-cabeleireiro.sql`
## Deploy Vercel 
https://agenda-cabeleireiro-crud.vercel.app/

## Tecnologias usadas

- Node.js
- Express
- dotenv
- Knex
- mysql2
- MySQL
- HTML
- CSS
- JavaScript puro
- nodemon

## Estrutura de pastas

```text
agenda-cabeleireiro-crud/
├── banco-de-dados/
│   └── database-agenda-cabeleireiro.sql
├── documentos/
├── público/
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── src/
│   ├── controllers/
│   │   └── agendamentosController.js
│   ├── db/
│   │   ├── knex.js
│   │   ├── migrations/
│   │   │   └── criar_tabela_agendamentos.js
│   │   └── seeds/
│   │       └── exemplo_agendamentos.js
│   ├── routes/
│   │   └── agendamentos.js
│   └── server.js
├── .env-modelo
├── .gitignore
├── knexfile.js
├── package.json
└── README.md
```

## Configuracao do `.env`

1. Copie `.env-modelo` para `.env`.
2. Ajuste usuario, senha, porta e nome do banco.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=agenda_cabeleireiro
PORT=3000
```

## Como criar o banco MySQL

Voce pode usar a migration ou o script SQL.

### Opcao 1: migration

1. Crie o banco manualmente no MySQL:

```sql
CREATE DATABASE IF NOT EXISTS agenda_cabeleireiro;
```

2. Rode:

```bash
npm run migrate
```

3. Rode o seed:

```bash
npm run seed
```

### Opcao 2: script SQL

Abra `banco-de-dados/database-agenda-cabeleireiro.sql` no MySQL Workbench, phpMyAdmin ou terminal e execute o script completo.

## Como rodar

1. Instale dependencias:

```bash
npm install
```

2. Crie o arquivo `.env`.
3. Crie o banco `agenda_cabeleireiro`.
4. Rode a migration:

```bash
npm run migrate
```

5. Rode o seed:

```bash
npm run seed
```

6. Inicie o servidor:

```bash
npm run dev
```

7. Acesse:

```text
http://localhost:3000
```

## Endpoints da API

- `GET /api/agendamentos`
- `GET /api/agendamentos/:id`
- `POST /api/agendamentos`
- `PUT /api/agendamentos/:id`
- `DELETE /api/agendamentos/:id`
- `PATCH /api/agendamentos/:id/realizar`
- `PATCH /api/agendamentos/:id/cancelar`
- `GET /api/agendamentos/relatorios/pendentes`
- `GET /api/agendamentos/relatorios/concluidos?inicio=YYYY-MM-DD&fim=YYYY-MM-DD`

## Como testar o CRUD

1. Abra o frontend.
2. Cadastre um agendamento com nome, telefone, servico, profissional e data/hora.
3. Confira se ele aparece na tabela.
4. Clique em editar, altere os dados e salve.
5. Clique em marcar como realizado.
6. Cadastre outro e cancele.
7. Exclua um registro de teste.
8. Use os filtros por nome, profissional e status.

## Como apresentar o projeto

1. Explique o tema escolhido.
2. Mostre o banco de dados e a tabela `Agendamentos`.
3. Apresente o backend e as rotas REST.
4. Abra o frontend e mostre o formulario.
5. Cadastre um agendamento.
6. Edite o registro.
7. Marque como realizado.
8. Cancele outro registro.
9. Exclua um agendamento.
10. Mostre os filtros e os relatorios.
