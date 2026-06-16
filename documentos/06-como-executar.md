# 06 - Como Executar

Siga estes passos para rodar o projeto localmente.

## 1. Instalar Node.js

Instale o Node.js no computador. Se possivel, use a versao LTS.

## 2. Instalar MySQL ou XAMPP

Instale o MySQL ou uma solucao como XAMPP, que ja traz um servidor de banco de dados.

## 3. Abrir a pasta no VS Code

Abra a pasta `agenda-cabeleireiro-crud` no Visual Studio Code.

## 4. Rodar o npm install

No terminal, execute:

```bash
npm install
```

## 5. Copiar o arquivo de modelo

Copie `.env-modelo` para `.env`.

## 6. Configurar usuario e senha do MySQL

Edite o arquivo `.env` com seu usuario, senha e porta do MySQL.

## 7. Criar o banco

Crie o banco `agenda_cabeleireiro` no MySQL:

```sql
CREATE DATABASE IF NOT EXISTS agenda_cabeleireiro;
```

## 8. Rodar a migration

Execute:

```bash
npm run migrate
```

## 9. Rodar o seed

Execute:

```bash
npm run seed
```

## 10. Rodar o servidor

Execute:

```bash
npm run dev
```

## 11. Abrir no navegador

Acesse:

```text
http://localhost:3000
```

## Observacao

Se preferir, voce tambem pode importar o script `banco-de-dados/database-agenda-cabeleireiro.sql` diretamente no MySQL em vez de usar migration e seed.

