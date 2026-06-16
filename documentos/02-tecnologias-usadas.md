# 02 - Tecnologias Usadas

## Node.js

Node.js e o ambiente de execucao usado para rodar JavaScript no servidor. Neste projeto ele executa a API e os arquivos do backend.

## Express

Express e um framework para Node.js que facilita a criacao de rotas, middlewares e respostas HTTP. Ele foi usado para criar a API REST do projeto.

## dotenv

O pacote `dotenv` carrega as variaveis do arquivo `.env` para `process.env`. Isso evita colocar senha e configuracoes fixas no codigo.

## Knex

Knex e um query builder. Ele ajuda a criar consultas no banco de forma organizada e tambem permite usar migrations e seeds.

Neste projeto ele foi usado para:

- criar a tabela `Agendamentos`;
- inserir registros de exemplo;
- consultar, atualizar e excluir dados.

## mysql2

O `mysql2` e o driver que faz a conexao do Node.js com o MySQL. Ele e usado junto com o Knex para executar as consultas no banco.

## MySQL

MySQL e o banco de dados relacional usado para armazenar os agendamentos.

## HTML

O HTML estrutura a interface do frontend:

- titulo;
- formulario;
- filtros;
- tabela de registros;
- botoes de acao.

## CSS

O CSS deixa a tela mais bonita, moderna e responsiva. Foi usado um tema elegante com tons escuros, dourado, bege e rosa suave para combinar com um salao.

## JavaScript puro

O JavaScript puro foi usado no frontend para:

- enviar dados para a API;
- listar agendamentos;
- preencher o formulario na edicao;
- excluir registros;
- marcar como realizado;
- cancelar agendamentos;
- aplicar filtros.

## nodemon

O `nodemon` reinicia o servidor automaticamente quando algum arquivo do backend muda. Isso facilita o desenvolvimento e a demonstracao em sala.

