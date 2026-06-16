// Antes de rodar esta migration, crie manualmente o banco definido em DB_NAME.

exports.up = function (knex) {
  return knex.schema.createTable('Agendamentos', function (table) {
    table.increments('idAgendamento').unsigned().primary().notNullable();
    table.string('NomeSolicitante', 254).notNullable();
    table.string('TelefoneSolicitante', 15).notNullable();
    table.dateTime('DataHoraAgendamento').notNullable();
    table.string('NomeProfissional', 254).notNullable();
    table.dateTime('DataHoraAtendimento').nullable();
    table.dateTime('DataHoraCancelamento').nullable();
    table.string('Servico', 100).notNullable();
    table.text('Observacoes').nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('Agendamentos');
};
