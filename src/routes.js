const express = require('express');
const CartoesDisponiveisController = require('./controllers/ProdutoSeguro/CartoesDisponiveisController');
const CalcularSeguroController = require('./controllers/ProdutoSeguro/CalcularSeguroController');

const ListarPlanosController = require('./controllers/ProdutoSeguro/ListarPlanosController');

const BuscarCartoesDisponiveisController = require('./controllers/SaqueComplementar/BuscarCartoesDisponiveisController');
const BuscaLimiteSaqueController = require('./controllers/SaqueComplementar/BuscarLimiteSaqueController');

const cpfs = require('./controllers/ConsultaCPF');
const startWS = require('./startWS');

const routes = express.Router();

routes.get(
  '/produtoSeguro/obterCartoesDisponiveis',
  CartoesDisponiveisController.index,
);
routes.get('/produtoSeguro/calcularSeguro', CalcularSeguroController.index);

routes.get('/produtoSeguro/listarPlanos', ListarPlanosController.index);

routes.get(
  '/SaqueComplementar/buscaLimiteSaque',
  BuscaLimiteSaqueController.index,
);
routes.get(
  '/SaqueComplementar/buscarCartoesDisponiveis',
  BuscarCartoesDisponiveisController.index,
);
routes.get('/cpfs', cpfs.index);
routes.get('/startWS', startWS.startWS);

module.exports = routes;
