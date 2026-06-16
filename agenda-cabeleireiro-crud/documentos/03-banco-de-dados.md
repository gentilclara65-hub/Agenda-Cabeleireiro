# 03 - Banco de Dados

O banco de dados usado no projeto se chama `agenda_cabeleireiro`.

Ele possui uma tabela principal chamada `Agendamentos`.

## Estrutura da tabela

| Campo | Tipo | Regra | Descricao |
| --- | --- | --- | --- |
| `idAgendamento` | `int unsigned` | primary key, auto increment, not null | Identificador unico do agendamento |
| `NomeSolicitante` | `varchar(254)` | not null | Nome da pessoa que solicitou o atendimento |
| `TelefoneSolicitante` | `varchar(15)` | not null | Telefone de contato do cliente |
| `DataHoraAgendamento` | `datetime` | not null | Data e hora marcadas para o atendimento |
| `NomeProfissional` | `varchar(254)` | not null | Nome do profissional responsavel |
| `DataHoraAtendimento` | `datetime` | nullable | Data e hora em que o atendimento foi realizado |
| `DataHoraCancelamento` | `datetime` | nullable | Data e hora do cancelamento |
| `Servico` | `varchar(100)` | not null | Tipo de servico solicitado |
| `Observacoes` | `text` | nullable | Informacoes extras do atendimento |

## Chave primaria

`idAgendamento` e a chave primaria da tabela. Ele identifica cada registro de forma unica.

Como e `auto increment`, o banco cria o valor automaticamente ao inserir um novo agendamento.

## Campos obrigatorios

Os campos obrigatorios sao:

- `NomeSolicitante`
- `TelefoneSolicitante`
- `DataHoraAgendamento`
- `NomeProfissional`
- `Servico`

Esses campos sao validados no backend antes de salvar.

## Campos nulos

Os campos que podem ficar nulos sao:

- `DataHoraAtendimento`
- `DataHoraCancelamento`
- `Observacoes`

Eles sao preenchidos apenas quando o sistema registra o atendimento ou o cancelamento, ou quando o usuario quiser deixar uma observacao.

## Exemplo de uso

Um agendamento pode ser salvo assim:

```json
{
  "NomeSolicitante": "Mariana Alves",
  "TelefoneSolicitante": "11988887777",
  "DataHoraAgendamento": "2026-06-16 09:00:00",
  "NomeProfissional": "Camila Rocha",
  "Servico": "Corte masculino",
  "Observacoes": "Cliente chegou recomendada pelo namorado."
}
```

Se o atendimento for realizado, o sistema preenche `DataHoraAtendimento`.

Se o agendamento for cancelado, o sistema preenche `DataHoraCancelamento`.

## Relacao com o status

O status nao e salvo em uma coluna separada.

Ele e montado com base nas datas:

- pendente: nenhum dos campos de atendimento ou cancelamento foi preenchido;
- realizado: `DataHoraAtendimento` foi preenchido;
- cancelado: `DataHoraCancelamento` foi preenchido.

