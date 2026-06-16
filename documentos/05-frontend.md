# 05 - Frontend

O frontend foi feito com HTML, CSS e JavaScript puro.

Ele usa `fetch` para conversar com a API REST e permite realizar todas as acoes do CRUD sem recarregar a pagina.

## Estrutura visual

A tela principal contem:

- titulo e subtitulo;
- formulario de cadastro e edicao;
- filtros por nome e profissional;
- botoes de visualizacao por status;
- cards com contadores;
- tabela com os agendamentos.

## Como o frontend consome a API

O arquivo `público/app.js` envia requisicoes para a rota base:

```text
/api/agendamentos
```

### Listagem

Ao abrir a pagina, o frontend chama a funcao que faz:

```javascript
fetch('/api/agendamentos')
```

Os dados retornados sao mostrados na tabela.

### Cadastro

Quando o usuario preenche o formulario e clica em salvar, o JavaScript monta um objeto com os campos digitados e envia para a API com `POST`.

### Edicao

Ao clicar em editar, o frontend busca o registro pelo id, preenche o formulario e troca o botao para modo de atualizacao.

Depois envia a requisicao `PUT` com os novos dados.

### Exclusao

Ao clicar em excluir, o frontend pede confirmacao e depois envia `DELETE` para a API.

### Registrar realizacao

Ao clicar em marcar como realizado, o frontend envia `PATCH /realizar`.

### Registrar cancelamento

Ao clicar em cancelar agendamento, o frontend envia `PATCH /cancelar`.

## Filtros

O frontend permite:

- buscar por nome do solicitante;
- buscar por profissional;
- ver todos;
- ver pendentes;
- ver realizados;
- ver cancelados.

Esses filtros sao enviados para a API como query string, por exemplo:

```text
/api/agendamentos?nome=mariana&status=pendente
```

## Formatacao de datas

Como o banco guarda datas e horas, o JavaScript converte esses valores para:

- exibicao na tabela;
- preenchimento do campo `datetime-local` na edicao.

Isso garante que o formulario mostre o horario correto quando um registro for editado.

## Status visual

O frontend mostra um badge com uma cor diferente para cada status:

- pendente;
- realizado;
- cancelado.

Isso ajuda a apresentar o sistema de forma mais clara durante a aula.
