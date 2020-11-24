const axios = require('axios');
require('dotenv').config();
const makelistaPlanos = require('../../xmls/ProdutoSeguro/listaPlanos');
const xml2js = require('xml2js');
const mysql = require('mysql');
const config = require('../../config/database');

const connection = mysql.createConnection(config);
const express = require('express');

const app = express();

module.exports = {
  async index(request, response) {
    async function foo() {
      const calcularSeguro = makelistaPlanos({
        login: process.env.LOGIN_ROBO_2,
        senha: process.env.SENHA_ROBO_2,
        codigoOrgao: request.query.codigoOrgao,
        codigoProdutoSeguro: request.query.codigoProdutoSeguro,
        entidade: request.query.entidade,
        matricula: request.query.matricula,
        numeroInternoConta: request.query.numeroInternoConta,
        renda: request.query.renda,
        tipoPagamentoSeguro: request.query.tipoPagamentoSeguro,
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
        const mensagemErro =          result['soapenv:Envelope']['soapenv:Body'][0][
            'ns1:listaPlanosResponse'
          ][0].listaPlanosReturn[0].mensagemDeErro[0]._;

        if (mensagemErro) {
          response.status(400).json({ message: mensagemErro });
        } else {
          const defaultListarPlanos =
            result['soapenv:Envelope']['soapenv:Body'][0][
            'ns1:listaPlanosResponse'
          ][0].listaPlanosReturn;
          const { planos } = defaultListarPlanos[0].planos[0];

          console.log(planos);

          const listaPlanos = planos.map((item) => ({
            nomePlano: item.nomePlano[0]._,
            valorCapitalSegurado: item.valorCapitalSegurado[0]._,
            valorPremio: item.valorPremio[0]._,
          }));

          response.json(listaPlanos);
        }
      });
    }

    foo().catch(err => {
      console.log(err);
    });
  },
};
