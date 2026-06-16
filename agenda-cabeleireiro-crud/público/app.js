const API_URL = '/api/agendamentos';

const estado = {
  filtroNome: '',
  filtroProfissional: '',
  filtroStatus: 'all',
  editandoId: null
};

const elementos = {};
let timeoutMensagem = null;

document.addEventListener('DOMContentLoaded', () => {
  elementos.form = document.getElementById('agendamentoForm');
  elementos.id = document.getElementById('idAgendamento');
  elementos.nome = document.getElementById('NomeSolicitante');
  elementos.telefone = document.getElementById('TelefoneSolicitante');
  elementos.servico = document.getElementById('Servico');
  elementos.profissional = document.getElementById('NomeProfissional');
  elementos.dataHora = document.getElementById('DataHoraAgendamento');
  elementos.observacoes = document.getElementById('Observacoes');
  elementos.btnSalvar = document.getElementById('btnSalvar');
  elementos.btnCancelarEdicao = document.getElementById('btnCancelarEdicao');
  elementos.btnBuscar = document.getElementById('btnBuscar');
  elementos.btnLimpar = document.getElementById('btnLimpar');
  elementos.filtroNome = document.getElementById('filtroNome');
  elementos.filtroProfissional = document.getElementById('filtroProfissional');
  elementos.tabela = document.getElementById('agendamentosTabela');
  elementos.listaResumo = document.getElementById('listaResumo');
  elementos.mensagem = document.getElementById('mensagem');

  elementos.form.addEventListener('submit', salvarAgendamento);
  elementos.btnCancelarEdicao.addEventListener('click', cancelarEdicao);
  elementos.btnBuscar.addEventListener('click', aplicarFiltros);
  elementos.btnLimpar.addEventListener('click', limparFiltros);

  document.querySelectorAll('[data-status]').forEach((botao) => {
    botao.addEventListener('click', () => {
      estado.filtroStatus = botao.dataset.status;
      atualizarBotoesStatus();
      carregarAgendamentos();
    });
  });

  atualizarBotoesStatus();
  carregarAgendamentos();
});

function normalizarTexto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function obterDataLocal(valor) {
  if (!valor) {
    return null;
  }

  const texto = String(valor).trim().replace(' ', 'T');
  const data = new Date(texto);

  return Number.isNaN(data.getTime()) ? null : data;
}

function formatarDataHora(valor) {
  const data = obterDataLocal(valor);

  if (!data) {
    return 'Nao informado';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(data);
}

function paraInputDateTime(valor) {
  const data = obterDataLocal(valor);

  if (!data) {
    return '';
  }

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');

  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

function obterStatusLabel(status) {
  const mapa = {
    pendente: 'Pendente',
    realizado: 'Realizado',
    cancelado: 'Cancelado'
  };

  return mapa[status] || 'Pendente';
}

function obterStatusClass(status) {
  const mapa = {
    pendente: 'status-pendente',
    realizado: 'status-realizado',
    cancelado: 'status-cancelado'
  };

  return mapa[status] || 'status-pendente';
}

function atualizarBotoesStatus() {
  document.querySelectorAll('[data-status]').forEach((botao) => {
    botao.classList.toggle('active', botao.dataset.status === estado.filtroStatus);
  });
}

function mostrarMensagem(texto, tipo = 'sucesso') {
  if (timeoutMensagem) {
    clearTimeout(timeoutMensagem);
  }

  elementos.mensagem.textContent = texto;
  elementos.mensagem.dataset.tipo = tipo;
  elementos.mensagem.hidden = !texto;

  if (texto) {
    timeoutMensagem = setTimeout(() => {
      elementos.mensagem.hidden = true;
      elementos.mensagem.textContent = '';
    }, 5000);
  }
}

async function lerMensagemErro(resposta) {
  try {
    const dados = await resposta.json();
    return dados.mensagem || dados.erro || 'Ocorreu um erro na requisicao.';
  } catch (error) {
    return 'Ocorreu um erro na requisicao.';
  }
}

function montarQueryString() {
  const parametros = new URLSearchParams();

  if (estado.filtroNome) {
    parametros.set('nome', estado.filtroNome);
  }

  if (estado.filtroProfissional) {
    parametros.set('profissional', estado.filtroProfissional);
  }

  if (estado.filtroStatus && estado.filtroStatus !== 'all') {
    parametros.set('status', estado.filtroStatus);
  }

  return parametros.toString();
}

async function buscarAgendamentos() {
  const queryString = montarQueryString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(await lerMensagemErro(resposta));
  }

  return resposta.json();
}

async function carregarAgendamentos() {
  elementos.tabela.innerHTML = `
    <tr>
      <td colspan="8" class="empty-cell">Carregando agendamentos...</td>
    </tr>
  `;

  try {
    const agendamentos = await buscarAgendamentos();
    renderizarAgendamentos(agendamentos);
  } catch (error) {
    elementos.tabela.innerHTML = `
      <tr>
        <td colspan="8" class="empty-cell">Nao foi possivel carregar os agendamentos.</td>
      </tr>
    `;
    mostrarMensagem(error.message, 'erro');
  }
}

function atualizarResumo(lista) {
  const total = lista.length;
  const pendentes = lista.filter((item) => item.status === 'pendente').length;
  const realizados = lista.filter((item) => item.status === 'realizado').length;
  const cancelados = lista.filter((item) => item.status === 'cancelado').length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statPendentes').textContent = pendentes;
  document.getElementById('statRealizados').textContent = realizados;
  document.getElementById('statCancelados').textContent = cancelados;

  const statusAtual = estado.filtroStatus === 'all' ? 'todos' : estado.filtroStatus;
  const filtrosAtivos = [estado.filtroNome, estado.filtroProfissional].filter(Boolean).length;

  elementos.listaResumo.textContent = `${total} registro(s) exibido(s)${filtrosAtivos ? ' com filtros ativos' : ''} | status: ${statusAtual}`;
}

function renderizarAgendamentos(lista) {
  atualizarResumo(lista);

  if (!lista.length) {
    elementos.tabela.innerHTML = `
      <tr>
        <td colspan="8" class="empty-cell">Nenhum agendamento encontrado.</td>
      </tr>
    `;
    return;
  }

  elementos.tabela.innerHTML = lista.map((item) => {
    const bloquearAcoes = item.status !== 'pendente';

    return `
      <tr>
        <td>${item.idAgendamento}</td>
        <td>
          <strong>${item.NomeSolicitante}</strong>
        </td>
        <td>${item.TelefoneSolicitante}</td>
        <td>${item.Servico}</td>
        <td>${item.NomeProfissional}</td>
        <td>${formatarDataHora(item.DataHoraAgendamento)}</td>
        <td>
          <span class="status-badge ${obterStatusClass(item.status)}">${obterStatusLabel(item.status)}</span>
        </td>
        <td>
          <div class="action-group">
            <button type="button" class="btn btn-small btn-ghost" onclick="editarAgendamento(${item.idAgendamento})">Editar</button>
            <button type="button" class="btn btn-small btn-danger" onclick="excluirAgendamento(${item.idAgendamento})">Excluir</button>
            <button type="button" class="btn btn-small btn-primary" onclick="marcarComoRealizado(${item.idAgendamento})" ${bloquearAcoes ? 'disabled' : ''}>Marcar como realizado</button>
            <button type="button" class="btn btn-small btn-secondary" onclick="cancelarAgendamento(${item.idAgendamento})" ${bloquearAcoes ? 'disabled' : ''}>Cancelar agendamento</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function limparFormulario() {
  elementos.form.reset();
  elementos.id.value = '';
  estado.editandoId = null;
  elementos.btnSalvar.textContent = 'Salvar agendamento';
  elementos.btnCancelarEdicao.hidden = true;
}

function preencherFormulario(agendamento) {
  elementos.id.value = agendamento.idAgendamento;
  elementos.nome.value = agendamento.NomeSolicitante || '';
  elementos.telefone.value = agendamento.TelefoneSolicitante || '';
  elementos.servico.value = agendamento.Servico || '';
  elementos.profissional.value = agendamento.NomeProfissional || '';
  elementos.dataHora.value = paraInputDateTime(agendamento.DataHoraAgendamento);
  elementos.observacoes.value = agendamento.Observacoes || '';
  estado.editandoId = agendamento.idAgendamento;
  elementos.btnSalvar.textContent = 'Atualizar agendamento';
  elementos.btnCancelarEdicao.hidden = false;
  document.getElementById('formCard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function obterAgendamentoPorId(id) {
  const resposta = await fetch(`${API_URL}/${id}`);

  if (!resposta.ok) {
    throw new Error(await lerMensagemErro(resposta));
  }

  return resposta.json();
}

async function salvarAgendamento(evento) {
  evento.preventDefault();

  const payload = {
    NomeSolicitante: normalizarTexto(elementos.nome.value),
    TelefoneSolicitante: normalizarTexto(elementos.telefone.value),
    Servico: normalizarTexto(elementos.servico.value),
    NomeProfissional: normalizarTexto(elementos.profissional.value),
    DataHoraAgendamento: elementos.dataHora.value,
    Observacoes: normalizarTexto(elementos.observacoes.value)
  };

  const metodo = estado.editandoId ? 'PUT' : 'POST';
  const url = estado.editandoId ? `${API_URL}/${estado.editandoId}` : API_URL;

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resposta.ok) {
      throw new Error(await lerMensagemErro(resposta));
    }

    const dados = await resposta.json();
    mostrarMensagem(dados.mensagem, 'sucesso');
    limparFormulario();
    carregarAgendamentos();
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
}

async function editarAgendamento(id) {
  try {
    const agendamento = await obterAgendamentoPorId(id);
    preencherFormulario(agendamento);
    mostrarMensagem('Edicao carregada para o formulario.', 'aviso');
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
}

async function excluirAgendamento(id) {
  const confirmado = window.confirm('Deseja excluir este agendamento?');

  if (!confirmado) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!resposta.ok) {
      throw new Error(await lerMensagemErro(resposta));
    }

    const dados = await resposta.json();
    mostrarMensagem(dados.mensagem, 'sucesso');

    if (String(estado.editandoId) === String(id)) {
      limparFormulario();
    }

    carregarAgendamentos();
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
}

async function marcarComoRealizado(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}/realizar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!resposta.ok) {
      throw new Error(await lerMensagemErro(resposta));
    }

    const dados = await resposta.json();
    mostrarMensagem(dados.mensagem, 'sucesso');

    if (String(estado.editandoId) === String(id)) {
      limparFormulario();
    }

    carregarAgendamentos();
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
}

async function cancelarAgendamento(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}/cancelar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!resposta.ok) {
      throw new Error(await lerMensagemErro(resposta));
    }

    const dados = await resposta.json();
    mostrarMensagem(dados.mensagem, 'sucesso');

    if (String(estado.editandoId) === String(id)) {
      limparFormulario();
    }

    carregarAgendamentos();
  } catch (error) {
    mostrarMensagem(error.message, 'erro');
  }
}

function aplicarFiltros() {
  estado.filtroNome = normalizarTexto(elementos.filtroNome.value);
  estado.filtroProfissional = normalizarTexto(elementos.filtroProfissional.value);
  carregarAgendamentos();
}

function limparFiltros() {
  elementos.filtroNome.value = '';
  elementos.filtroProfissional.value = '';
  estado.filtroNome = '';
  estado.filtroProfissional = '';
  estado.filtroStatus = 'all';
  atualizarBotoesStatus();
  carregarAgendamentos();
}

function cancelarEdicao() {
  limparFormulario();
  mostrarMensagem('Edicao cancelada.', 'aviso');
}
