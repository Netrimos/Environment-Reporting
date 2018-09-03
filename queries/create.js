//const con = require('../db/con').localCon;
const con = require('../db/con').remoteCon;
const utils = require('../utils/format');
/*










*/

module.exports.addComm = (req, res, next) => {
  let query =`INSERT INTO CommLog (employeeName,timeSent,priority,
  initialComm,
  statusFrom,
  statusTo,
  environments,
  message,
  recordedBy,
  timeRecorded,
  childOf,
  assocTo,
  followUp,
  plannedOutage,
  messageFromTeam,
  currentOwner,
  finalOwner,
  active,
  GUID)
  VALUES (
  '${req.body.employeeName}',
  '${req.body.timeSent}',
  '${req.body.priority}',
  '${req.body.initialComm}',
  '${req.body.statusFrom}',
  '${req.body.statusTo}',
  '${req.body.environments}',
  '${req.body.message}',
  '${req.body.recordedBy}',
  '${utils.formatTime(Date.now(),"DBdateTime")}',
  '${req.body.childOf}',
  '${req.body.assocTo}',
  '${req.body.followUp}',
  '${req.body.plannedOutage}',
  '${req.body.messageFromTeam}',
  '${req.body.currntOwner}',
  '${req.body.finalOwner}',
  '${req.body.active}',
  '${utils.createGUID()}');`;
  con.query(query, (err, result, fields)=>{
      if (err) throw err;
      res.send(201, result);
    });
    next();
  };

/*
{
	"employeeName": "Erik Thompson",
	"timeSent": "2018-08-21 18:02:00",
	"priority": 3,
	"initialComm": 1,
	"statusFrom": "",
	"statusTo": "new",
	"environments": "DEV3 DEV4",
	"message": "Everything is on fire and people are screaming..!  jk, we can't log in.",
	"recordedBy": "Bob Miller",
	"childOf": "",
	"assocTo": "",
	"followUp": "",
	"plannedOutage": 0,
	"messageFromTeam": "RM",
	"currntOwner": "TDM",
	"finalOwner": "",
	"active": 1
}
*/









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
  con.query(query, (err, result, fields)=>{
      if (err) throw err;
      res.send(201, result);
  });
  next();
};

module.exports.addPlannedOutage = (req, res, next) => {
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
