//const con = require('../db/con').localCon;
const con = require('../db/con').remoteCon;

module.exports.getCommLog = (req, res, next) => {
  con.query("SELECT * FROM CommLog;",(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};

module.exports.getCommLogLatest = (req, res, next) => {
  con.query("SELECT * FROM CommLog WHERE initialComm = 1;",(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};

module.exports.getCommLogById = (req, res, next) => {
  con.query(`SELECT * FROM CommLog WHERE id = ${req.id};`,(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};

// TODO Need to make a join and internal reference...
module.exports.getCommLogDetailsById = (req, res, next) => {
  con.query(`SELECT * FROM CommLog WHERE id = ${req.id};`,(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};

module.exports.getLatestCompiledStatus = (req, res, next) => {
  con.query(
    `SELECT * FROM (
        SELECT * FROM CompiledStatus ORDER BY id DESC LIMIT 10
    ) sub
    ORDER BY id ASC`,(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};

module.exports.getCompiledStatusById = (req, res, next) => {
  con.query(`SELECT * FROM CompiledStatus WHERE id = ${req.id};`,(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};


module.exports.getPlanned = (req, res, next) => {
  con.query("SELECT * FROM PlannedOutages WHERE active > 0;",(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};

module.exports.getFollowup = (req, res, next) => {
  con.query("SELECT * FROM followupactions;",(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};
