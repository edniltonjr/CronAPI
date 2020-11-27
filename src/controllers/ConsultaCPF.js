require('dotenv').config();
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config/database');

const horaAtual = moment().format('HH:mm');

const inicioBMG = '19:00';
const fimBMG = '06:00';

const connection = mysql.createConnection(config);

module.exports = {
  async index(request, response) {
    if (horaAtual >= inicioBMG || horaAtual <= fimBMG) {
      const select = `SELECT cpf from bmg.TEMPORARIA where estado IS NULL LIMIT ${process.env.LIMITE}`;

      connection.query(select, (err, result) => {
        if (err) throw err;
        response.json(result);
      });
    } else {
      const select =        'SELECT cpf from bmg.TEMPORARIA where estado IS NULL LIMIT 15';
      console.log(select);

      connection.query(select, (err, result) => {
        if (err) throw err;
        response.json(result);
      });
    }
  },
};

