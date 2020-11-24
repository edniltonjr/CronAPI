require('dotenv').config();
const mysql = require('mysql');
const config = require('../config/database');

const connection = mysql.createConnection(config);

module.exports = {
  async index(request, response) {
    const select =
      'select count(*) as falta from bmg.TEMPORARIA where estado IS NULL';
    const select2 =      "select count(*) as tem from bmg.TEMPORARIA where estado = '1' ";

    connection.query(select, select2, (err, result) => {
      if (err) throw err;
      console.log(result[0].falta);

      connection.query(select2, (erro, result2) => {
        if (erro) throw err;
        console.log(result2[0].tem);

        response.json({
          processados: result2[0].tem,
          pendentes: result[0].falta,
        });
      });
    });
  },
};
