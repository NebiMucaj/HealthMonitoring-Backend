var mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : 'healthmonitoring',
    multipleStatements: true,
    timezone: 'utc'  
    
    
  }); 

connection.connect(function(err) {
    if (err) {
      return console.error('error: ' + err.message);
    }

    console.log('Connected to the MySQL server.');
  });

  exports.connection=connection;
  exports.escape = mysql.escape;