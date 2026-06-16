# 01 - Visao Geral

O sistema **Agenda de Cabeleireiro** foi criado para controlar agendamentos de atendimento profissional em um salao.

Ele atende a atividade da faculdade porque entrega:

- cadastro de novos agendamentos;
- consulta de registros cadastrados;
- edicao de agendamentos;
- exclusao de agendamentos;
- registro de atendimento realizado;
- registro de cancelamento;
- relatatorios de pendentes e concluidos;
- frontend simples, funcional e facil de apresentar.

## Objetivo do sistema

O objetivo e permitir que um profissional ou recepcionista acompanhe os atendimentos do salao em um unico lugar.

Com isso, fica mais facil:

- saber quem vai ser atendido;
- ver qual profissional esta responsavel;
- registrar quando o atendimento foi realizado;
- registrar quando um cliente cancela;
- consultar agendamentos pendentes;
- consultar atendimentos concluidos em um periodo.

## Como o sistema atende ao enunciado

O enunciado pede uma tabela principal chamada `Agendamentos` e uma API REST para CRUD completo.

Este projeto atende isso da seguinte forma:

- a tabela principal foi criada no MySQL;
- o backend foi feito em Node.js com Express;
- o acesso ao banco foi feito com Knex e mysql2;
- o frontend consome a API com `fetch`;
- as rotas especiais `realizar` e `cancelar` representam as acoes pedidas pelo professor;
- os relatorios de pendentes e concluidos foram incluidos;
- a aplicacao e servida pela pasta `public`, sem usar React, Vue ou Angular.

## Campos extras

Foram adicionados dois campos opcionais:

- `Servico`
- `Observacoes`

Eles foram incluidos para deixar o sistema mais adequado ao tema de cabeleireiro, porque ajudam a registrar o tipo de atendimento e observacoes importantes sobre cada cliente.

## Regra de status

O sistema nao precisa de uma coluna extra de status no banco.

O status e calculado a partir das datas:

- se `DataHoraCancelamento` existir, o status e `Cancelado`;
- se `DataHoraAtendimento` existir, o status e `Realizado`;
- se nenhuma das duas existir, o status e `Pendente`.

