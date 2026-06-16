# 04 - API REST

## O que e API REST

REST e um estilo de arquitetura para criar APIs usando o protocolo HTTP.

Em uma API REST, cada rota representa um recurso, e os metodos HTTP indicam a acao:

- `GET` para consultar;
- `POST` para criar;
- `PUT` para atualizar;
- `PATCH` para atualizar parte do recurso;
- `DELETE` para excluir.

Neste projeto, o recurso principal e `agendamentos`.

## Base da API

Todas as rotas ficam abaixo de:

```text
/api/agendamentos
```

## Rotas principais

### `GET /api/agendamentos`

Lista todos os agendamentos.

Tambem aceita filtros por query string:

- `nome`
- `profissional`
- `servico`
- `status`

Exemplo:

```text
/api/agendamentos?nome=mariana&status=pendente
```

Resposta exemplo:

```json
[
  {
    "idAgendamento": 1,
    "NomeSolicitante": "Mariana Alves",
    "TelefoneSolicitante": "11988887777",
    "DataHoraAgendamento": "2026-06-16 09:00:00",
    "NomeProfissional": "Camila Rocha",
    "DataHoraAtendimento": null,
    "DataHoraCancelamento": null,
    "Servico": "Corte masculino",
    "Observacoes": "Cliente chegou recomendada pelo namorado.",
    "status": "pendente"
  }
]
```

### `GET /api/agendamentos/:id`

Busca um agendamento pelo id.

Resposta exemplo:

```json
{
  "idAgendamento": 1,
  "NomeSolicitante": "Mariana Alves",
  "TelefoneSolicitante": "11988887777",
  "DataHoraAgendamento": "2026-06-16 09:00:00",
  "NomeProfissional": "Camila Rocha",
  "DataHoraAtendimento": null,
  "DataHoraCancelamento": null,
  "Servico": "Corte masculino",
  "Observacoes": "Cliente chegou recomendada pelo namorado.",
  "status": "pendente"
}
```

Se nao existir, a API responde com `404`.

### `POST /api/agendamentos`

Cadastra um novo agendamento.

Campos obrigatorios:

- `NomeSolicitante`
- `TelefoneSolicitante`
- `DataHoraAgendamento`
- `NomeProfissional`
- `Servico`

Exemplo de envio:

```json
{
  "NomeSolicitante": "Ana Costa",
  "TelefoneSolicitante": "11999998888",
  "DataHoraAgendamento": "2026-06-18T14:30",
  "NomeProfissional": "Renata Silva",
  "Servico": "Escova",
  "Observacoes": "Preferencia por finalizacao suave"
}
```

Exemplo de resposta:

```json
{
  "mensagem": "Agendamento cadastrado com sucesso.",
  "agendamento": {
    "idAgendamento": 6,
    "NomeSolicitante": "Ana Costa",
    "TelefoneSolicitante": "11999998888",
    "DataHoraAgendamento": "2026-06-18 14:30:00",
    "NomeProfissional": "Renata Silva",
    "DataHoraAtendimento": null,
    "DataHoraCancelamento": null,
    "Servico": "Escova",
    "Observacoes": "Preferencia por finalizacao suave",
    "status": "pendente"
  }
}
```

Se faltar algum campo obrigatorio, a API responde com `400`.

### `PUT /api/agendamentos/:id`

Altera os dados do agendamento.

Exemplo de envio:

```json
{
  "NomeSolicitante": "Ana Costa",
  "TelefoneSolicitante": "11999998888",
  "DataHoraAgendamento": "2026-06-18T15:00",
  "NomeProfissional": "Renata Silva",
  "Servico": "Escova",
  "Observacoes": "Horario atualizado"
}
```

Exemplo de resposta:

```json
{
  "mensagem": "Agendamento atualizado com sucesso.",
  "agendamento": {
    "idAgendamento": 6,
    "NomeSolicitante": "Ana Costa",
    "TelefoneSolicitante": "11999998888",
    "DataHoraAgendamento": "2026-06-18 15:00:00",
    "NomeProfissional": "Renata Silva",
    "DataHoraAtendimento": null,
    "DataHoraCancelamento": null,
    "Servico": "Escova",
    "Observacoes": "Horario atualizado",
    "status": "pendente"
  }
}
```

Se o id nao existir, a API responde com `404`.

### `DELETE /api/agendamentos/:id`

Exclui um agendamento.

Exemplo de resposta:

```json
{
  "mensagem": "Agendamento excluido com sucesso."
}
```

Se o id nao existir, a API responde com `404`.

## Rotas extras

### `PATCH /api/agendamentos/:id/realizar`

Registra a realizacao do atendimento.

Se nao for enviado valor no corpo, a data e hora atual sao usadas.

Exemplo de envio:

```json
{
  "DataHoraAtendimento": "2026-06-18T15:55"
}
```

Exemplo de resposta:

```json
{
  "mensagem": "Atendimento registrado com sucesso.",
  "agendamento": {
    "idAgendamento": 6,
    "status": "realizado"
  }
}
```

Nao e permitido usar essa rota quando o agendamento ja estiver cancelado.

### `PATCH /api/agendamentos/:id/cancelar`

Registra o cancelamento do agendamento.

Se nao for enviado valor no corpo, a data e hora atual sao usadas.

Exemplo de envio:

```json
{
  "DataHoraCancelamento": "2026-06-18T13:20"
}
```

Exemplo de resposta:

```json
{
  "mensagem": "Cancelamento registrado com sucesso.",
  "agendamento": {
    "idAgendamento": 6,
    "status": "cancelado"
  }
}
```

Nao e permitido usar essa rota quando o agendamento ja estiver realizado.

## Relatorios

### `GET /api/agendamentos/relatorios/pendentes`

Lista os agendamentos que ainda nao foram realizados e nao foram cancelados.

Resposta exemplo:

```json
[
  {
    "idAgendamento": 1,
    "status": "pendente"
  }
]
```

### `GET /api/agendamentos/relatorios/concluidos?inicio=YYYY-MM-DD&fim=YYYY-MM-DD`

Lista os agendamentos concluidos dentro do periodo informado.

Exemplo:

```text
/api/agendamentos/relatorios/concluidos?inicio=2026-06-01&fim=2026-06-30
```

Resposta exemplo:

```json
[
  {
    "idAgendamento": 2,
    "status": "realizado"
  }
]
```

## Erros

Mensagens comuns:

- `400` quando um campo obrigatorio nao foi enviado;
- `400` quando a operacao nao faz sentido, como cancelar um agendamento ja realizado;
- `404` quando o id nao existe;
- `500` quando ocorre um erro interno inesperado.

