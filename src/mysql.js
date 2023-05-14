const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '13thRitz@1997',
  database: 'initial_db'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Mysql Connected!');
});

module.exports = connection