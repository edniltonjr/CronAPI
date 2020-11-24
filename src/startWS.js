/*eslint-disable */
// console.log = () => { }
// console.error = () => { }


const mysql = require('mysql2');
const moment = require('moment');
const cron = require('node-cron');
const config = require('./config/database');
const formatedCPF = require('./utils/formatedCPF');

const connection = mysql.createConnection(config).promise();
const axios = require('axios');
// const { response } = require('express');

async function f(row) {

  // VARRE OS CPFS
  const urlBusca = `http://localhost:3000/v0/produtoSeguro/obterCartoesDisponiveis?cpf=${formatedCPF(
    row.cpf,
  )}`;





  try {

    console.info(urlBusca)
    const cargaCartoes = await axios.get(urlBusca)
    console.info(cargaCartoes.data.length)
    for (const respost of cargaCartoes.data) {
      console.info(respost.numeroInternoConta)
      const consulta = `SELECT * FROM bmg.WS_seguro where numeroInternoConta = '${respost.numeroInternoConta}' `;
      const [consultaQuery] = await connection.query(consulta)
      if (consultaQuery.length > 0) {
        console.log(
          `Atualizando Conta Interna: ${respost.numeroInternoConta}...`,
        );
        const atualizacao = `UPDATE bmg.WS_seguro set limiteCartao = '${respost.limiteCartao}', created_at = TIMEDIFF(CONVERT(current_timestamp(), TIME), "03:00:00") where numeroInternoConta = '${respost.numeroInternoConta[0]._}'`;
        await connection.query(atualizacao)
        console.log('Dados Atualizados');

        // ATUALIZA CPF CONSULTADO
        const att = `UPDATE bmg.TEMPORARIA set estado = '1', dt_atualizacao = TIMEDIFF(CONVERT(current_timestamp(), TIME), '03:00:00') where cpf = '${row.cpf}' and estado IS NULL`;
        await connection.query(att);
        console.log('CPF: ', row.cpf, 'CONSULTADO COM SUCESSO');

      } else {
        const insert = `INSERT INTO bmg.WS_seguro (cpf, nomeCliente, dataNascimento, codigoEntidade, sequencialOrgao, orgaoFormatado, numeroInternoConta, numeroCartao, limiteCartao, ehElegivel, motivoElegibilidade, created_at)
        VALUES ?`;

        const values = [
          // eslint-disable-next-line no-sparse-arrays
          [
            row.cpf,
            respost.nomeCliente,
            moment(respost.dataNascimento).format('YYYY-MM-DD'),
            respost.codigoEntidade,
            respost.sequencialOrgao,
            respost.orgaoFormatado,
            respost.numeroInternoConta,
            respost.numeroCartao,
            respost.limiteCartao,
            respost.ehElegivel,
            respost.motivoElegibilidade === undefined
              ? ''
              : respost.motivoElegibilidade,
            moment().format('YYYY-MM-DD HH:mm:ss'),
          ],
        ];
        await connection.query(insert, [values]);
        console.log(
          `Conta de Nº ${respost.numeroInternoConta} - ${respost.matricula} Inserido Com Sucesso!`,
        );

        const listaPlanos = `http://localhost:3000/v0/produtoSeguro/listarPlanos?codigoOrgao=${respost.sequencialOrgao}&codigoProdutoSeguro=5&entidade=${respost.codigoEntidade}&matricula=${respost.matricula}&numeroInternoConta=${respost.numeroInternoConta}&renda=${respost.limiteCartao}&tipoPagamentoSeguro=1`;
        console.log(listaPlanos);
        let planos;
        try {
          planos = await axios.get(listaPlanos)
        }
        catch (err) {

          console.log(err.response);
          const sql = `INSERT INTO bmg.WS_seguro_planos (numeroInternoConta, matricula, nomePlano, valorCapitalSegurado, valorPremio, mensagemErro)
          VALUES ('${respost.numeroInternoConta}', '${respost.matricula}', '', '', '', '${err.response.message}' )`;
          await connection.query(sql);
          console.log('PLANO/ERRO INSERIDO COM SUCESSO');
          return;
        }

        for(const plans of planos.data){
          console.log('PLANO: ', plans.nomePlano);
          console.log(
            'CAPITALSEGURADO: ',
            plans.valorCapitalSegurado,
          );
          console.log('valorPremio: ', plans.valorPremio);

          const sql = `INSERT INTO bmg.WS_seguro_planos (numeroInternoConta, matricula, nomePlano, valorCapitalSegurado, valorPremio) VALUES ('${respost.numeroInternoConta}', '${respost.matricula}', '${plans.nomePlano}', '${plans.valorCapitalSegurado}', '${plans.valorPremio}' )`;
          await connection.query(sql);
          console.log('PLANO INSERIDO COM SUCESSO');
        };


        // ATUALIZA CPF CONSULTADO
        const atualizacao = `UPDATE bmg.TEMPORARIA set estado = '1', dt_atualizacao = TIMEDIFF(CONVERT(current_timestamp(), TIME), '03:00:00') where cpf = '${row.cpf}' and estado IS NULL`;
        await connection.query(atualizacao);
        console.log('CPF: ', row.cpf, 'CONSULTADO COM SUCESSO');
      }
    };

  } catch (err) {


    if (!err.isAxiosError) {
      throw err
    }

    console.log(err.response.data)

    const sql1 = `INSERT INTO bmg.WS_seguro (cpf, ehElegivel, motivoElegibilidade) VALUES ('${row.cpf}', '${false}', '${err.response.data.message
      }')`;
    await connection.query(sql1);
    console.log('CARTAO INSERIDO COM SUCESSO');

    const atualizacao = `UPDATE bmg.TEMPORARIA set estado = '1', dt_atualizacao = TIMEDIFF(CONVERT(current_timestamp(), TIME), '03:00:00') where cpf = '${row.cpf}' and estado IS NULL`;
    await connection.query(atualizacao);
    console.log('CPF: ', row.cpf, 'CARTAO CONSULTADO COM SUCESSO');



  }

  // console.info(i++)
}

let i = 1;

module.exports = {
  async startWS(request, response) {

    let cargaCPF;

    try {
      cargaCPF = await axios.get('http://localhost:3000/v0/cpfs');
    } catch (err) {
      return response.json({ erro: err })
    }
    try {
      const promises =
        Promise.all(
          cargaCPF.data.map(row=> f(row))
        )

      await promises;

      response.json({ message: 'Aplicação Iniciada' })
    } catch (err) {
      response.send(err.message)
      console.error(err)
    }

  },


  async startCron(request, response) {
    try{
      const rodar = await axios.get('http://35.237.59.25:3000/v0/startWS');
      console.log(rodar)
      if (rodar.status === 200) {
        try {
          console.log('REEXECUTANDO...')
          await axios.get('http://35.237.59.25:3000/v0/rodar');
        }
        catch(err) {
          console.log(err)

        }
      }

    }
    catch(err) {
      console.log(err)
    }
    response.json('APLICACAO EXECUTADA')

  }

};
