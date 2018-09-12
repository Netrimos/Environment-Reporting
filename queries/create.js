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
  let myGUID = utils.createGUID();
  let thisDurationString = "";
  let thisStausDuration = "";
  let startTime = "";
  //Ability to ForceTime...
  let msgTime;
  msgTime = (utils.toTimestamp(req.body.msgTime));
  if (req.body.msgTime) msgTime = (utils.toTimestamp(req.body.msgTime));
  else msgTime = (utils.timestamp());

  //If this has a parent compate times to add the diff to the db as a value and a string...
  if (req.body.childOf != ''){
    startTime = req.body.parentMsgTime;
    thisStausDuration = msgTime - startTime;
    thisDurationString =  utils.timeDifference(msgTime,startTime,'string');
  }
  console.log('thisStausDuration' + thisStausDuration);
  console.log('thisDurationString' + thisDurationString);

  let query =`
    INSERT INTO CommLog (
      GUID,
      childOf,
      assocTo,
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
      finalOwner,
      active,
      thisDuration,
      thisDurationString,
      followUp
    )
    VALUES(
      '${myGUID}',
      '${myGUID}',
      '${req.body.assocTo}',
      '${req.body.initialComm}',
      '${req.body.recordedBy}',
      '${req.body.plannedOutage}',
      '${req.body.entryFrom}',
      '${utils.formatTime(msgTime,'DBdateTime')}',
      '${req.body.priority}',
      '${req.body.environments}',
      '${req.body.errorCode}',
      '${req.body.message}',
      '${req.body.messageFromTeam}',
      '${utils.formatTime(msgTime,'DBdateTime')}',
      '${req.body.statusFrom}',
      '${req.body.statusTo}',
      '${req.body.currentOwner}',
      '${req.body.finalOwner}',
      '${req.body.active}',
      '${thisStausDuration}',
      '${thisDurationString}',
      '${req.body.followUp}'
    );`;
  con.query(query, (err, result, fields)=>{
      if (err) throw err;
      result.GUID = myGUID;
      result.parentDate = msgTime;
      res.send(201, result);
  });
  next();
};



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
