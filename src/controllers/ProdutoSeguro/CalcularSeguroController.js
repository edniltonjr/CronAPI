const axios = require('axios');
require('dotenv').config();
const makeObterCalcularSeguro = require('../../xmls/ProdutoSeguro/calcularSeguro');
const xml2js = require('xml2js');
const mysql = require('mysql');
const config = require('../../config/database');

const connection = mysql.createConnection(config);
const express = require('express');

const app = express();

module.exports = {
  async index(request, response) {
    async function foo() {
      const calcularSeguro = makeObterCalcularSeguro({
        login: process.env.LOGIN_ROBO_2,
        senha: process.env.SENHA_ROBO_2,
        cpf: request.query.cpf,
        codigoEntidade: request.query.codigoEntidade,
        limiteRenda: request.query.limiteRenda,
        sequencialOrgao: request.query.sequencialOrgao,
      });

      const res = await axios.post(
        'https://ws1.bmgconsig.com.br/webservices/ProdutoSeguroWebService?wsdl',
        calcularSeguro,
        {
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
            'Accept-Encoding': 'gzip.deflate',
            'Content-Length': calcularSeguro.length,
            SOAPAction: '',
          },
        },
      );

      const parser = new xml2js.Parser({ explicitArray: true, trim: true });
      parser.parseString(res.data, (err, result) => {
        const defaultCalcularSeguro =          result['soapenv:Envelope']['soapenv:Body'][0][
            'ns1:calcularSeguroResponse'
          ][0].calcularSeguroReturn[0];
        if (defaultCalcularSeguro.mensagemDeErro[0]._ !== undefined) {
          response
            .status(400)
            .json({ message: defaultCalcularSeguro.mensagemDeErro[0]._ });
        } else {
          response.json({
            cpf: request.query.cpf,
            capitalSegurado: defaultCalcularSeguro.capitalSegurado[0]._,
            valorDoSeguro: defaultCalcularSeguro.valorDoSeguro[0]._,
          });
        }
      });
    }

    foo().catch((err) => {
      console.log(err.response);
    });
  },
};
