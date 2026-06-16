exports.seed = async function (knex) {
  await knex('Agendamentos').del();

  await knex('Agendamentos').insert([
    {
      NomeSolicitante: 'Mariana Alves',
      TelefoneSolicitante: '11988887777',
      DataHoraAgendamento: '2026-06-16 09:00:00',
      NomeProfissional: 'Camila Rocha',
      DataHoraAtendimento: null,
      DataHoraCancelamento: null,
      Servico: 'Corte masculino',
      Observacoes: 'Cliente chegou recomendada pelo namorado.'
    },
    {
      NomeSolicitante: 'Joao Pedro',
      TelefoneSolicitante: '11977776666',
      DataHoraAgendamento: '2026-06-14 10:30:00',
      NomeProfissional: 'Renata Silva',
      DataHoraAtendimento: '2026-06-14 11:15:00',
      DataHoraCancelamento: null,
      Servico: 'Escova',
      Observacoes: 'Finalizar com protetor termico.'
    },
    {
      NomeSolicitante: 'Carla Mendes',
      TelefoneSolicitante: '11966665555',
      DataHoraAgendamento: '2026-06-13 14:00:00',
      NomeProfissional: 'Patricia Lima',
      DataHoraAtendimento: null,
      DataHoraCancelamento: '2026-06-13 12:20:00',
      Servico: 'Barba',
      Observacoes: 'Cancelado por motivo de viagem.'
    },
    {
      NomeSolicitante: 'Beatriz Souza',
      TelefoneSolicitante: '11955554444',
      DataHoraAgendamento: '2026-06-17 15:00:00',
      NomeProfissional: 'Camila Rocha',
      DataHoraAtendimento: null,
      DataHoraCancelamento: null,
      Servico: 'Hidratacao',
      Observacoes: 'Usar mascara de reconstrucao.'
    },
    {
      NomeSolicitante: 'Fernando Costa',
      TelefoneSolicitante: '11944443333',
      DataHoraAgendamento: '2026-06-12 17:00:00',
      NomeProfissional: 'Renata Silva',
      DataHoraAtendimento: '2026-06-12 17:55:00',
      DataHoraCancelamento: null,
      Servico: 'Coloracao',
      Observacoes: 'Tom castanho claro.'
    }
  ]);
};
