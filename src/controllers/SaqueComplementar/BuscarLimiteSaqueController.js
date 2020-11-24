const axios = require('axios');
require('dotenv').config();
const makebuscarLimiteSaque = require('../../xmls/SaqueComplementar/buscarLimiteSaque');
const xml2js = require('xml2js');
const mysql = require('mysql');
const config = require('../../config/database');

const connection = mysql.createConnection(config);
const express = require('express');

const app = express();

module.exports = {
  async index(request, response) {
    async function foo() {
      const buscarLimiteSaque = makebuscarLimiteSaque({
        login: process.env.LOGIN_ROBO_2,
        senha: process.env.SENHA_ROBO_2,
        cpf: request.query.cpf,
        codigoEntidade: request.query.codigoEntidade,
        matricula: request.query.matricula,
        sequencialOrgao:
          request.query.sequencialOrgao === '0'
            ? ''
            : request.query.sequencialOrgao,
        numeroContaInterna: request.query.numeroContaInterna,
        tipoSaque: request.query.tipoSaque,
        tipoSeguro: request.query.tipoSeguro,
      });

      const res = await axios.post(
        'https://ws1.bmgconsig.com.br/webservices/SaqueComplementar?wsdl',
        buscarLimiteSaque,
        {
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
            'Accept-Encoding': 'gzip.deflate',
            'Content-Length': buscarLimiteSaque.length,
            SOAPAction: '',
          },
        },
      );

      const parser = new xml2js.Parser({ explicitArray: true, trim: true });
      parser.parseString(res.data, (err, result) => {
        const meujson2 =          result['soapenv:Envelope']['soapenv:Body'][0][
            'ns1:buscarLimiteSaqueResponse'
          ][0].buscarLimiteSaqueReturn[0];

        response.json({
          valorMargem: meujson2.valorMargem[0]._,
          valorSaqueMaximo: meujson2.valorSaqueMaximo[0]._,
          valorSaqueMinimo: meujson2.valorSaqueMinimo[0]._,
          capitalSegurado:
            meujson2.excecaoGenerica[0]._ === 'true'
            || meujson2.mensagemDeErro[0]._ != null
              ? '0.0'
              : meujson2.resultadoConsultaElegibilidadeDeSeguro[0].seguro[0]
                .capitalSegurado[0]._,
          valorDoSeguro:
            meujson2.excecaoGenerica[0]._ === 'true'
            || meujson2.mensagemDeErro[0]._ != null
              ? '0.0'
              : meujson2.resultadoConsultaElegibilidadeDeSeguro[0].seguro[0]
                .valorDoSeguro[0]._,
          descricaoSeguro:
            meujson2.excecaoGenerica[0]._ === 'true'
            || meujson2.mensagemDeErro[0]._ != null
              ? null
              : meujson2.resultadoConsultaElegibilidadeDeSeguro[0].seguro[0]
                .descricaoSeguro[0]._,
          tipoSeguro:
            meujson2.excecaoGenerica[0]._ === 'true'
            || meujson2.mensagemDeErro[0]._ != null
              ? null
              : meujson2.resultadoConsultaElegibilidadeDeSeguro[0].seguro[0]
                .tipoSeguro[0]._,
          seguroElegivel:
            meujson2.excecaoGenerica[0]._ === 'true'
            || meujson2.mensagemDeErro[0]._ != null
              ? null
              : meujson2.resultadoConsultaElegibilidadeDeSeguro[0].elegivel[0]
                ._ === 'true'
                ? 1
                : 0,
          mesangemDeErroLimiteDeSaque:
            meujson2.excecaoGenerica[0]._ === 'true'
            || meujson2.mensagemDeErro[0]._ != null
              ? null
              : meujson2.resultadoConsultaElegibilidadeDeSeguro[0].elegivel[0]
                ._ === 'true'
                ? ''
                : meujson2.resultadoConsultaElegibilidadeDeSeguro[0]
                  .motivoDeNaoEligibilidade[0]._,
        });
      });
    }

    foo().catch((err) => {
      response.status(500).json({
        statusCode: err.response.status,
        statusText: err.response.statusText,
      });
      console.log(err.response);
    });
  },
};
