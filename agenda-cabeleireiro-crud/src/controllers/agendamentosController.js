const db = require('../db/knex');

function normalizarTexto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function formatarDataHoraLocal(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  const segundo = String(data.getSeconds()).padStart(2, '0');

  return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
}

function normalizarDataHoraParaBanco(valor) {
  if (valor === null || valor === undefined || valor === '') {
    return null;
  }

  if (valor instanceof Date) {
    return Number.isNaN(valor.getTime()) ? null : formatarDataHoraLocal(valor);
  }

  const texto = String(valor).trim();

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(texto)) {
    return `${texto.replace('T', ' ')}:00`;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(texto)) {
    return texto.replace('T', ' ');
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(texto)) {
    return `${texto}:00`;
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(texto)) {
    return texto;
  }

  const data = new Date(texto);

  if (Number.isNaN(data.getTime())) {
    return null;
  }

  return formatarDataHoraLocal(data);
}

function montarBaseDeConsulta() {
  return db('Agendamentos').select(
    '*',
    db.raw(`
      CASE
        WHEN DataHoraCancelamento IS NOT NULL THEN 'cancelado'
        WHEN DataHoraAtendimento IS NOT NULL THEN 'realizado'
        ELSE 'pendente'
      END AS status
    `)
  );
}

function aplicarFiltroStatus(query, status) {
  const valor = normalizarTexto(status).toLowerCase();

  if (valor === 'pendente') {
    query.whereNull('DataHoraAtendimento').whereNull('DataHoraCancelamento');
  }

  if (valor === 'realizado' || valor === 'concluido' || valor === 'concluidos') {
    query.whereNotNull('DataHoraAtendimento').whereNull('DataHoraCancelamento');
  }

  if (valor === 'cancelado') {
    query.whereNotNull('DataHoraCancelamento');
  }
}

function validarCamposObrigatorios(dados) {
  const faltantes = [];

  if (!dados.NomeSolicitante) faltantes.push('NomeSolicitante');
  if (!dados.TelefoneSolicitante) faltantes.push('TelefoneSolicitante');
  if (!dados.DataHoraAgendamento) faltantes.push('DataHoraAgendamento');
  if (!dados.NomeProfissional) faltantes.push('NomeProfissional');
  if (!dados.Servico) faltantes.push('Servico');

  return faltantes;
}

function montarDadosDoFormulario(body) {
  const dados = {
    NomeSolicitante: normalizarTexto(body.NomeSolicitante),
    TelefoneSolicitante: normalizarTexto(body.TelefoneSolicitante),
    DataHoraAgendamento: normalizarDataHoraParaBanco(body.DataHoraAgendamento),
    NomeProfissional: normalizarTexto(body.NomeProfissional),
    Servico: normalizarTexto(body.Servico),
    Observacoes: normalizarTexto(body.Observacoes) || null
  };

  return dados;
}

function montarTimestampAtual() {
  return formatarDataHoraLocal(new Date());
}

async function buscarPorId(id) {
  return montarBaseDeConsulta().where('idAgendamento', id).first();
}

function validarId(param) {
  const id = Number.parseInt(param, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

exports.listar = async (req, res) => {
  try {
    const { nome, profissional, servico, status } = req.query;
    const query = montarBaseDeConsulta();

    if (nome) {
      query.where('NomeSolicitante', 'like', `%${normalizarTexto(nome)}%`);
    }

    if (profissional) {
      query.where('NomeProfissional', 'like', `%${normalizarTexto(profissional)}%`);
    }

    if (servico) {
      query.where('Servico', 'like', `%${normalizarTexto(servico)}%`);
    }

    aplicarFiltroStatus(query, status);

    const agendamentos = await query.orderBy('DataHoraAgendamento', 'desc');

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    res.status(500).json({ mensagem: 'Erro ao listar agendamentos.' });
  }
};

exports.obter = async (req, res) => {
  try {
    const id = validarId(req.params.id);

    if (!id) {
      return res.status(400).json({ mensagem: 'ID invalido.' });
    }

    const agendamento = await buscarPorId(id);

    if (!agendamento) {
      return res.status(404).json({ mensagem: 'Agendamento nao encontrado.' });
    }

    res.json(agendamento);
  } catch (error) {
    console.error('Erro ao buscar agendamento:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar agendamento.' });
  }
};

exports.inserir = async (req, res) => {
  try {
    const dados = montarDadosDoFormulario(req.body || {});
    const faltantes = validarCamposObrigatorios(dados);

    if (normalizarTexto(req.body?.DataHoraAgendamento) && !dados.DataHoraAgendamento) {
      return res.status(400).json({ mensagem: 'DataHoraAgendamento invalida.' });
    }

    if (faltantes.length > 0) {
      return res.status(400).json({
        mensagem: `Campos obrigatorios nao informados: ${faltantes.join(', ')}.`
      });
    }

    if (dados.TelefoneSolicitante.length > 15) {
      return res.status(400).json({
        mensagem: 'TelefoneSolicitante deve ter no maximo 15 caracteres.'
      });
    }

    const [idAgendamento] = await db('Agendamentos').insert({
      NomeSolicitante: dados.NomeSolicitante,
      TelefoneSolicitante: dados.TelefoneSolicitante,
      DataHoraAgendamento: dados.DataHoraAgendamento,
      NomeProfissional: dados.NomeProfissional,
      Servico: dados.Servico,
      Observacoes: dados.Observacoes,
      DataHoraAtendimento: null,
      DataHoraCancelamento: null
    });

    const agendamento = await buscarPorId(idAgendamento);

    res.status(201).json({
      mensagem: 'Agendamento cadastrado com sucesso.',
      agendamento
    });
  } catch (error) {
    console.error('Erro ao inserir agendamento:', error);
    res.status(500).json({ mensagem: 'Erro ao cadastrar agendamento.' });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const id = validarId(req.params.id);

    if (!id) {
      return res.status(400).json({ mensagem: 'ID invalido.' });
    }

    const existente = await buscarPorId(id);

    if (!existente) {
      return res.status(404).json({ mensagem: 'Agendamento nao encontrado.' });
    }

    const dadosDoFormulario = montarDadosDoFormulario(req.body || {});
    const dadosAtualizados = {
      NomeSolicitante: dadosDoFormulario.NomeSolicitante || existente.NomeSolicitante,
      TelefoneSolicitante: dadosDoFormulario.TelefoneSolicitante || existente.TelefoneSolicitante,
      DataHoraAgendamento:
        dadosDoFormulario.DataHoraAgendamento || existente.DataHoraAgendamento,
      NomeProfissional: dadosDoFormulario.NomeProfissional || existente.NomeProfissional,
      Servico: dadosDoFormulario.Servico || existente.Servico,
      Observacoes:
        req.body && Object.prototype.hasOwnProperty.call(req.body, 'Observacoes')
          ? dadosDoFormulario.Observacoes
          : existente.Observacoes,
      DataHoraAtendimento:
        req.body && Object.prototype.hasOwnProperty.call(req.body, 'DataHoraAtendimento')
          ? normalizarDataHoraParaBanco(req.body.DataHoraAtendimento)
          : existente.DataHoraAtendimento,
      DataHoraCancelamento:
        req.body && Object.prototype.hasOwnProperty.call(req.body, 'DataHoraCancelamento')
          ? normalizarDataHoraParaBanco(req.body.DataHoraCancelamento)
          : existente.DataHoraCancelamento
    };

    if (normalizarTexto(req.body?.DataHoraAgendamento) && !dadosDoFormulario.DataHoraAgendamento) {
      return res.status(400).json({ mensagem: 'DataHoraAgendamento invalida.' });
    }

    const faltantes = validarCamposObrigatorios(dadosAtualizados);

    if (faltantes.length > 0) {
      return res.status(400).json({
        mensagem: `Campos obrigatorios nao informados: ${faltantes.join(', ')}.`
      });
    }

    if (dadosAtualizados.TelefoneSolicitante.length > 15) {
      return res.status(400).json({
        mensagem: 'TelefoneSolicitante deve ter no maximo 15 caracteres.'
      });
    }

    await db('Agendamentos').where('idAgendamento', id).update(dadosAtualizados);

    const agendamento = await buscarPorId(id);

    res.json({
      mensagem: 'Agendamento atualizado com sucesso.',
      agendamento
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar agendamento.' });
  }
};

exports.excluir = async (req, res) => {
  try {
    const id = validarId(req.params.id);

    if (!id) {
      return res.status(400).json({ mensagem: 'ID invalido.' });
    }

    const existente = await buscarPorId(id);

    if (!existente) {
      return res.status(404).json({ mensagem: 'Agendamento nao encontrado.' });
    }

    await db('Agendamentos').where('idAgendamento', id).del();

    res.json({ mensagem: 'Agendamento excluido com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir agendamento:', error);
    res.status(500).json({ mensagem: 'Erro ao excluir agendamento.' });
  }
};

exports.registrarRealizacao = async (req, res) => {
  try {
    const id = validarId(req.params.id);

    if (!id) {
      return res.status(400).json({ mensagem: 'ID invalido.' });
    }

    const existente = await buscarPorId(id);

    if (!existente) {
      return res.status(404).json({ mensagem: 'Agendamento nao encontrado.' });
    }

    if (existente.DataHoraCancelamento) {
      return res.status(400).json({
        mensagem: 'Nao e permitido marcar como realizado um agendamento cancelado.'
      });
    }

    if (existente.DataHoraAtendimento) {
      return res.status(400).json({
        mensagem: 'Este agendamento ja foi marcado como realizado.'
      });
    }

    const dataEnviada = normalizarTexto(req.body?.DataHoraAtendimento);
    const dataFinal = dataEnviada
      ? normalizarDataHoraParaBanco(dataEnviada)
      : montarTimestampAtual();

    if (dataEnviada && !dataFinal) {
      return res.status(400).json({ mensagem: 'DataHoraAtendimento invalida.' });
    }

    await db('Agendamentos')
      .where('idAgendamento', id)
      .update({ DataHoraAtendimento: dataFinal });

    const agendamento = await buscarPorId(id);

    res.json({
      mensagem: 'Atendimento registrado com sucesso.',
      agendamento
    });
  } catch (error) {
    console.error('Erro ao registrar realizacao:', error);
    res.status(500).json({ mensagem: 'Erro ao registrar realizacao do atendimento.' });
  }
};

exports.registrarCancelamento = async (req, res) => {
  try {
    const id = validarId(req.params.id);

    if (!id) {
      return res.status(400).json({ mensagem: 'ID invalido.' });
    }

    const existente = await buscarPorId(id);

    if (!existente) {
      return res.status(404).json({ mensagem: 'Agendamento nao encontrado.' });
    }

    if (existente.DataHoraAtendimento) {
      return res.status(400).json({
        mensagem: 'Nao e permitido cancelar um agendamento ja realizado.'
      });
    }

    if (existente.DataHoraCancelamento) {
      return res.status(400).json({
        mensagem: 'Este agendamento ja foi cancelado.'
      });
    }

    const dataEnviada = normalizarTexto(req.body?.DataHoraCancelamento);
    const dataFinal = dataEnviada
      ? normalizarDataHoraParaBanco(dataEnviada)
      : montarTimestampAtual();

    if (dataEnviada && !dataFinal) {
      return res.status(400).json({ mensagem: 'DataHoraCancelamento invalida.' });
    }

    await db('Agendamentos')
      .where('idAgendamento', id)
      .update({ DataHoraCancelamento: dataFinal });

    const agendamento = await buscarPorId(id);

    res.json({
      mensagem: 'Cancelamento registrado com sucesso.',
      agendamento
    });
  } catch (error) {
    console.error('Erro ao registrar cancelamento:', error);
    res.status(500).json({ mensagem: 'Erro ao registrar cancelamento do agendamento.' });
  }
};

exports.listarPendentes = async (req, res) => {
  try {
    const agendamentos = await montarBaseDeConsulta()
      .whereNull('DataHoraAtendimento')
      .whereNull('DataHoraCancelamento')
      .orderBy('DataHoraAgendamento', 'asc');

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar pendentes:', error);
    res.status(500).json({ mensagem: 'Erro ao listar agendamentos pendentes.' });
  }
};

exports.listarConcluidos = async (req, res) => {
  try {
    const inicio = normalizarTexto(req.query.inicio);
    const fim = normalizarTexto(req.query.fim);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(inicio) || !/^\d{4}-\d{2}-\d{2}$/.test(fim)) {
      return res.status(400).json({
        mensagem: 'Informe inicio e fim no formato YYYY-MM-DD.'
      });
    }

    if (inicio > fim) {
      return res.status(400).json({
        mensagem: 'A data inicial nao pode ser maior que a data final.'
      });
    }

    const agendamentos = await montarBaseDeConsulta()
      .whereNotNull('DataHoraAtendimento')
      .whereNull('DataHoraCancelamento')
      .whereBetween('DataHoraAtendimento', [`${inicio} 00:00:00`, `${fim} 23:59:59`])
      .orderBy('DataHoraAtendimento', 'desc');

    res.json(agendamentos);
  } catch (error) {
    console.error('Erro ao listar concluidos:', error);
    res.status(500).json({ mensagem: 'Erro ao listar agendamentos concluidos.' });
  }
};
