//const con = require('../db/con').localCon;
const con = require('../db/con').remoteCon;
const utils = require('../utils/format');

module.exports.addPlannedOutage = (req, res, next) => {
  //console.log(req)
  let myGUID = utils.createGUID();
  let plannedDuration = req.body.plannedDuration;
  let startTime = utils.toTimestamp(req.body.startTime);
  let thisDurationString = "";
  let thisStausDuration = "";
  let isBehind = 0;
  //Ability to ForceTime...
  let msgTime;
  msgTime = (utils.toTimestamp(req.body.msgTime));
  if (req.body.msgTime) msgTime = (utils.toTimestamp(req.body.msgTime));
  else msgTime = (utils.timestamp());

  //If this has a parent compate times to add the diff to the db as a value and a string...
  if (req.body.childOf != ''){
    thisStausDuration = msgTime - startTime;
    if (plannedDuration < thisStausDuration && req.body.active == 1) {
      isBehind = 1;
    };
    thisDurationString =  utils.timeDifference(msgTime,startTime,'string');
  }
  function calculateDuration(time){
    time = utils.toTimestamp('1970-01-01 ' + time);
    if (time >= 18000) return time-18000;
    else return 18000-time; //(18000 = timezone offset...)
    //return time-18000;
  }

  let query =`
  INSERT INTO PlannedOutages (
  GUID,
  msgTime,
  thisStausDuration,
  thisDurationString,
  behindSchedule,
  childOf,
  initialComm,
  subject,
  entryFrom,
  environments,
  message,
  msgFrom,
  msgFromTeam,
  startTime,
  plannedDuration,
  active,
  activeState
  )
  VALUES(
  '${myGUID}',
  '${utils.formatTime(msgTime,'DBdateTime')}',
  '${thisStausDuration}',
  '${thisDurationString}',
  '${isBehind}',
  '${req.body.childOf}',
  '${req.body.initialComm}',
  '${req.body.subject}',
  '${req.body.entryFrom}',
  '${req.body.environments}',
  '${req.body.message}',
  '${req.body.msgFrom}',
  '${req.body.msgFromTeam}',
  '${utils.formatTime(startTime,'DBdateTime')}',
  '${calculateDuration(req.body.plannedDuration)}',
  '${req.body.active}',
  '${req.body.activeState}'
);`;
  //console.log(query);res.send(201,'complete');
  con.query(query, (err, result, fields)=>{
   if (err) throw err;
    result.GUID = myGUID;
    res.send(201, result);
  });
    next();
};

module.exports.addComLog = (req, res, next) => {
  //let parentData = {GUID : "", parentDate : ""};
  if (req.body.length > 1 ) {
    processAddCommLog(req.body[0]).then((response)=>{//Add initial parent info and receive data for children
       for (i = 0; i < req.body.length; i++){
          if (i>0){ //add parent data to children
           req.body[i].childOf = response.GUID;
           req.body[i].parentMsgTime = response.parentDate;
           processAddCommLog(req.body[i]);
          }
       }
    });
  }
  else response = processAddCommLog(req.body);
  res.send(201, "items added");
  next();
};

async function processAddCommLog(req, res){
  let myGUID;
  myGUID = utils.createGUID();
  let thisDurationString = "";
  let thisStausDuration = "";
  let startTime = "";
  //Ability to ForceTime...
  let msgTime;
  msgTime = (utils.toTimestamp(req.msgTime));
  //if (req.body.msgTime) msgTime = (utils.toTimestamp(req.body.msgTime));
  //else msgTime = (utils.timestamp(req.body.msgTime));
  let childOf = (val) => { if (val == "") return myGUID; else return val; }

  //If this has a parent compate times to add the diff to the db as a value and a string...
  if (req.childOf != ''){
    startTime = req.parentMsgTime;
    thisStausDuration = msgTime - startTime;
    thisDurationString =  utils.timeDifference(msgTime,startTime,'string');
  }

  let query =`
    INSERT INTO CommLog (
      GUID,
      childOf,
      initialComm,
      recordedBy,
      plannedOutage,
      entryFrom,
      msgTime,
      priority,
      environments,
      errorCode,
      message,
      messageFromTeam,
      timeRecorded,
      statusFrom,
      statusTo,
      currentOwner,
      active,
      thisDuration,
      thisDurationString,
      followUp,
      subject
    )
    VALUES(
      '${myGUID}',
      '${childOf(req.childOf)}',
      '${req.initialComm}',
      '${req.recordedBy}',
      '${req.plannedOutage}',
      '${req.entryFrom}',
      '${utils.formatTime(msgTime,'DBdateTime')}',
      '${req.priority}',
      '${req.environments}',
      '${req.errorCode}',
      '${req.message}',
      '${req.messageFromTeam}',
      '${utils.formatTime(msgTime,'DBdateTime')}',
      '${req.statusFrom}',
      '${req.statusTo}',
      '${req.currentOwner}',
      '${req.active}',
      '${thisStausDuration}',
      '${thisDurationString}',
      '${req.followUp}',
      '${req.subject}'
    );`;
     //console.log(req);
     //res.send(201,'complete');
  let myResponse = {};
  myResponse.GUID = myGUID;
  myResponse.parentDate = msgTime;

   con.query(query, (err, result, fields)=>{
     if (err) throw err;
      result.GUID = myGUID;
      result.parentDate = msgTime;
      //res.send(201, result);
  });//.then(()=>return myResponse;);
  return myResponse;
}

module.exports.addComStatus = (req, res, next) => {
  let query =
  `INSERT INTO CompiledStatus (GUID,issueOwner, issueDuration, CommLogGUID, explanationReference, environmentReference, dateCreated, dateCompleted)
  VALUES (
  '${utils.createGUID()}',
  '${req.body.issueOwner}',
  '${req.body.issueDuration}',
  '${req.body.CommLogGUID}',
  '${req.body.explanationReference}',
  '${req.body.environmentReference}',
  '${req.body.dateCreated}',
  '${req.body.dateCompleted}');`;
  //con.query(query, (err, result, fields)=>{
  //    if (err) throw err;
  //    res.send(201, result);
  //});
  next();
};

module.exports.addPlannedOutageOLD = (req, res, next) => {
  if (!req.body.active) {
    //TODO return error if active is not present
    //throw console.error(`need to supply active status - 0=complete 1=active 2=pending`);
    //next();
  }
  let query =
  `INSERT INTO PlannedOutages (GUID, environments, message, status, fromTeam, timeAdded, startTime, duration, active, activeState)
  VALUES (
  '${utils.createGUID()}',
  '${req.body.environments}',
  '${req.body.message}',
  '${req.body.status}',
  '${req.body.fromTeam}',
  '${utils.formatTime(Date.now(),"DBdateTime")}',
  '${req.body.startTime}',
  '${req.body.duration}',
  '${req.body.active}',
  '${req.body.activeState}');`;
  con.query(query, (err, result, fields)=>{
      if (err) throw err;
      res.send(201, result);
  });
  next();
};
