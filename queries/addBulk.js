//const con = require('../db/con').remoteCon;
const utils = require('../utils/format');
const addData = require('./create');

module.exports.plannedOutage = (req, res, next) => {

    let parentGUID;
    var item = {};
    req.body.forEach((i)=>{
       item.body = i;
       //console.log(item.body);
      if (i.initialComm == 1) {
//TODO  FIX BULK
          //let response = addData.addPlannedOutage(item, res, next)
          console.log(res.GUID);
        }

      else {req.body.childOf = parentGUID;}
        //console.log(i);
        //console.log(' ');
    });
    //console.log(req.body);
    res.send(201,'complete');
};

module.exports.commLog = (req, res, next) => {
    console.log(req.body.length);
    res.send(201,'complete');
};
