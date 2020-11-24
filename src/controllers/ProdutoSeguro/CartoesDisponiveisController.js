const axios = require('axios');
require('dotenv').config();
const makeObterCartoesDisponiveis = require('../../xmls/ProdutoSeguro/obterCartoesDisponiveis');
const xml2js = require('xml2js');
const mysql = require('mysql');
const config = require('../../config/database');

const connection = mysql.createConnection(config);
const express = require('express');

const app = express();
const formatedCPF = require('../../utils/formatedCPF');

module.exports = {
  async index(request, response) {
    async function foo() {
      const obterCartoesDisponiveis = makeObterCartoesDisponiveis({
        login: process.env.LOGIN_ROBO_2,
        senha: process.env.SENHA_ROBO_2,
        cpf: formatedCPF(request.query.cpf),
      });

      const res = await axios.post(
        'https://ws1.bmgconsig.com.br/webservices/ProdutoSeguroWebService?wsdl',
        obterCartoesDisponiveis,
        {
          headers: {
            'Content-Type': 'text/xml;charset=UTF-8',
            'Accept-Encoding': 'gzip.deflate',
            'Content-Length': obterCartoesDisponiveis.length,
            SOAPAction: '',
          },
        },
      );

      const parser = new xml2js.Parser({ explicitArray: true, trim: true });
      parser.parseString(res.data, (err, result) => {
        const defaults =          result['soapenv:Envelope']['soapenv:Body'][0][
            'ns1:obterCartoesDisponiveisResponse'
          ][0].obterCartoesDisponiveisReturn;

        const resp =
          defaults[0].cartaoClienteAtivoVendaSeguro[0]
          .cartaoClienteAtivoVendaSeguro;

        if (defaults[0].mensagemDeErro[0]._ !== undefined) {
          response
            .status(400)
            .json({ message: defaults[0].mensagemDeErro[0]._ });
        } else {
          const result = resp.map((item) => ({
            nomeCliente: item.nomeCliente[0]._,
            cpf: item.cpf[0]._,
            matricula: item.codigoCliente[0]._,
            dataNascimento: item.dataNascimento[0]._,
            codigoEntidade: item.codigoEntidade[0]._,
            sequencialOrgao: item.sequencialOrgao[0]._,
            orgaoFormatado: item.orgaoFormatado[0]._,
            numeroCartao: item.numeroCartao[0]._,
            limiteCartao: item.limiteCartao[0]._,
            numeroInternoConta: item.numeroInternoConta[0]._,
            ehElegivel: item.ehElegivel[0]._,
            motivoElegibilidade: item.motivoElegibilidade[0]._,
          }));

          response.json(result);
        }
      });
    }

    foo().catch((err) => {
      console.log(err);
    });
  },
};
