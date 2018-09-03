const mysql = require('mysql');

module.exports.localCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "@wLee1699",
  database: "AllyEnvReporting"
});

module.exports.remoteCon =  mysql.createConnection({
  host: "mi3-ss15.a2hosting.com",
  user: "erikmtho_admin",
  password: "@wLee1699",
  database: "erikmtho_ally-env-status"
});
