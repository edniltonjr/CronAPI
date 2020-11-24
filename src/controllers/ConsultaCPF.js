require('dotenv').config();
const mysql = require('mysql');
const config = require('../config/database');

const connection = mysql.createConnection(config);

module.exports = {
  async index(request, response) {
    const select =      'SELECT cpf from bmg.TEMPORARIA where estado IS NULL LIMIT 10';

    connection.query(select, (err, result) => {
      if (err) throw err;
      response.json(result);
    });
  },
};
