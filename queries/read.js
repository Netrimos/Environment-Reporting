//const con = require('../db/con').localCon;
const con = require('../db/con').remoteCon;

module.exports.getCommLog = (req, res, next) => {
  con.query("SELECT * FROM CommLog;",(err, result, fields)=>{
    if (err) throw err;
    res.send(200, result);
  });
  next();
};

module.exports.getCommLogTopLevel = (req, res, next) => {
  con.query("SELECT * FROM `CommLog` WHERE `timeRecorded` >= (SELECT NOW() + INTERVAL -14 DAY) ORDER BY `msgTime`, `childOf`;",(err, result, fields)=>{
//TODO... need to put a limit on this...
//TODO... the logic may simplify if you just manage the LAST item instead of the parent...
    if (err) throw err;

    let newResult = [];
    let parentItemParking = {};
    let msgCountParking = 0;

    for (i=0; i<result.length; i++ ){
      //console.log (result[i].id);
      if (result[i].initialComm === 1) {
        parentItemParking = result[i];
        msgCountParking = 1;
          if (i+1 === result.length || result[i+1].initialComm === 1) {
            newResult.push(parentItemParking);
          }
        //console.log ("parent item in group = " + result[i].id);
        }
      else if (i+1 === result.length || result[i+1].initialComm === 1){
        parentItemParking.lastMessage = result[i].message;
        parentItemParking.lastOwner = result[i].currentOwner;
        parentItemParking.lastMsgTime = result[i].msgTime;
        parentItemParking.lastDuration = result[i].thisDurationString;
        parentItemParking.active = result[i].active;
        parentItemParking.itemCount = msgCountParking;
        newResult.push(parentItemParking);
        //console.log ("last item in group = " + result[i].id);
      }
      else msgCountParking++;
    }
    res.send(200, newResult);
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
    con.query(`SELECT * FROM CommLog WHERE childOf = '${req.id}' ORDER BY msgTime;`,(err, result, fields)=>{
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

module.exports.getPlannedTopLevel = (req, res, next) => {
  con.query("SELECT * FROM PlannedOutages ORDER BY `childOf`, `msgTime`;",(err, result, fields)=>{
//TODO... need to put a limit on this...
//TODO... the logic may simplify if you just manage the LAST item instead of the parent...
    if (err) throw err;

    let newResult = [];
    let parentItemParking = {};
    let msgCountParking = 0;

    for (i=0; i<result.length; i++ ){
      if (result[i].initialComm === 1) {
        parentItemParking = result[i];
        msgCountParking = 1;
        if (i+1 === result.length || result[i+1].initialComm === 1) {
          newResult.push(parentItemParking);
        }
      }
      else if (i+1 === result.length || result[parseInt(i+1)].initialComm === 1){
        //console.log(result[i].id);
        //console.log(result[i].thisStausDuration);
        parentItemParking.lastMessage = result[i].message;
        parentItemParking.lastMsgFrom = result[i].msgFrom;
        parentItemParking.lastMsgTime = result[i].msgTime;
        parentItemParking.thisStatusDuration = result[i].thisStatusDuration;
        parentItemParking.lastDurationString = result[i].thisDurationString;
        parentItemParking.active = result[i].active;
        parentItemParking.activeState = result[i].activeState;
        parentItemParking.itemCount = msgCountParking;
        newResult.push(parentItemParking);
        //console.log ("last item in group = " + result[i].id);
      }
      else msgCountParking++;
    }
    res.send(200, newResult);
  });
  next();
};

module.exports.getPlanned = (req, res, next) => {
  con.query("SELECT * FROM PlannedOutages;",(err, result, fields)=>{
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
