//const con = require('../db/con').localCon;
const con = require('../db/con').remoteCon;

module.exports.removeCommunicationById = (req, res, next) => {
  con.query(`DELETE FROM CommLog WHERE id = ${req.body.id};`,(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};
