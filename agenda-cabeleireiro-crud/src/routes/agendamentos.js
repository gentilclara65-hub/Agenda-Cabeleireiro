const express = require('express');
const controller = require('../controllers/agendamentosController');

const router = express.Router();

router.get('/relatorios/pendentes', controller.listarPendentes);
router.get('/relatorios/concluidos', controller.listarConcluidos);
router.get('/', controller.listar);
router.get('/:id', controller.obter);
router.post('/', controller.inserir);
router.put('/:id', controller.atualizar);
router.patch('/:id/realizar', controller.registrarRealizacao);
router.patch('/:id/cancelar', controller.registrarCancelamento);
router.delete('/:id', controller.excluir);

module.exports = router;
