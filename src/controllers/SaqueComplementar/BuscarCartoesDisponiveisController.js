const axios = require('axios');
require('dotenv').config();
const makebuscarCartoesDisponiveis = require('../../xmls/SaqueComplementar/buscarCartoesDisponiveis');
const xml2js = require('xml2js');
const mysql = require('mysql');
const config = require('../../config/database');

const connection = mysql.createConnection(config);
const express = require('express');

const app = express();

module.exports = {
  async index(request, response) {
    async function foo() {
      const buscarCartoesDisponiveis = makebuscarCartoesDisponiveis({
        login: process.env.LOGIN_ROBO_2,
        senha: process.env.SENHA_ROBO_2,
        cpf: request.query.cpf,
        codigoEntidade: request.query.codigoEntidade,
        sequencialOrgao:
          request.query.sequencialOrgao === '0'
            ? ''
            : request.query.sequencialOrgao,
      });

      const res = await axios.post(
        'https://ws1.bmgconsig.com.br/webservices/SaqueComplementar?wsdl',
        buscarCartoesDisponiveis,
        {
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
            'Accept-Encoding': 'gzip.deflate',
            'Content-Length': buscarCartoesDisponiveis.length,
            SOAPAction: '',
          },
        },
      );

      const parser = new xml2js.Parser({ explicitArray: true, trim: true });
      parser.parseString(res.data, (err, result) => {
        defaultCartoesDisp =          result['soapenv:Envelope']['soapenv:Body'][0][
            'ns1:buscarCartoesDisponiveisResponse'
          ][0].buscarCartoesDisponiveisReturn[0].cartoesRetorno[0]
            .cartoesRetorno[0];

        response.json({
          cpfImpedidoComissionar:
            defaultCartoesDisp.cpfImpedidoComissionar[0]._,
          entidade: defaultCartoesDisp.entidade[0]._,
          liberado: defaultCartoesDisp.liberado[0]._,
          matricula: defaultCartoesDisp.matricula[0]._,
          mensagemImpedimento:
            defaultCartoesDisp.mensagemImpedimento[0]._ === undefined
              ? ''
              : defaultCartoesDisp.mensagemImpedimento[0]._,
          numeroAdesao: defaultCartoesDisp.numeroAdesao[0]._,
          numeroCartao: defaultCartoesDisp.numeroCartao[0]._,
          numeroContaInterna: defaultCartoesDisp.numeroContaInterna[0]._,
        });
      });
    }

    foo().catch((err) => {
      response.status(500).json({
        statusCode: err.response.status,
        statusText: err.response.statusText,
      });
      console.log(err.response.data);
    });
  },
};
