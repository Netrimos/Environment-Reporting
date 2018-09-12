/*
function to make all numbers two digits 1 = 01
Also option for txt with singular logic 1 min / 2 mins
stringToAdd is whatever you would like...
*/
function twoDigits(num, stringToAdd){

  num = Math.floor(num);
  let notSingular = true;
  if (num === 1 || num === 0) notSingular = false;
  let numWithZero = '0'+ num;
  numWithZero = numWithZero.substr(-2);
  if (stringToAdd) {
     num = `${num}${stringToAdd}`;
     if (notSingular) num = num + 's';
  }
  else num = numWithZero;
  return num;
}


module.exports.createGUID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports.timestamp = () => { return Math.floor(Date.now() / 1000); }

module.exports.toTimestamp = (strDate) => {
  // accepts 08/18/2018 15:05:53
  // accepts 08-18-2018 15:05:53
  // accepts 15:05:53
  //console.log(strDate.toString().length);
  //console.log(strDate.toString().length);

  switch(strDate.toString().length){
    case 19: break;
    case 8: strDate = "01/01/1970 "+strDate; break;
    default: return ".toTimeStamp: improper date or time"; break;
  }

   var datum = Date.parse(strDate);
   //datum = datum-18000; //calculating Timezone...  -5 EST
   return datum/1000;
}

module.exports.timeDifference = (timestampA, timestampB, type) => {
  //console.log(timestampA);
  //console.log(timestampB);

/* error handling ========================= */
  let a, b;
  switch(timestampA.toString().length){
    case 10: a = timestampA; break;
    case 13: a = timestampA/1000; break;
    default: a = timestampA; break;
    //default: return `You need a 10 or 13 digit timestamp, you sent this ${timestampA} in the first of two args`; break;
    }
  switch(timestampB.toString().length){
    case 10: b = timestampB; break;
    case 13: b = timestampB/1000; break;
    default: b = timestampB; break;
    //default: return `You need a 10 or 13 digit timestamp, you sent this ${timestampB} in the second of two args`; break;
  }
/*end of error handling ========================== */

  let timeDiff = a - b;
  let hoursCalc = timeDiff / 3600;
  let minsCalc = (hoursCalc - Math.floor(hoursCalc)) * 60;
  let secsCalc = (minsCalc - Math.floor(minsCalc)) * 60;
  hoursCalc = Math.round(hoursCalc);
  minsCalc = Math.floor(minsCalc);
  secsCalc = Math.round(secsCalc);
  //console.log('calc hours ' + hoursCalc);
  //console.log('calc mins ' + minsCalc);
  //console.log('calc secs ' + secsCalc);
  let dateString = twoDigits(hoursCalc, 'hr')+ ', '+twoDigits(minsCalc, 'min');

  switch(type){
    case 'string': return dateString; break;
    case 'hour':  return twoDigits(hoursCalc); break;
    case 'min': return twoDigits(minsCalc); break;
    case 'sec': return twoDigits(secsCalc); break;
    //case 'time': return `${Math.floor(hoursCalc)}:${Math.floor(minsCalc)}:${Math.floor(secsCalc)} `; break;
    case 'time': return `${twoDigits(hoursCalc)}:${twoDigits(minsCalc)}:${twoDigits(secsCalc)} `; break;
    default:
      return `
        Dude, put something as a type...
        timeDifference = function (timestampA, timestampB, type){}

        Example:
        string = 18 hrs, 50 mins
        hour = 18
        min = 50
        sec = 30
        time = 18:50:30`;
    break;
  }
}
//TODO cleanup the .substr below with twoDigits function above...
module.exports.formatTime = (timestamp, type) => {
  let d;
  switch(timestamp.toString().length){
    case 10: d = new Date(timestamp*1000); break;
    case 13: d = new Date(timestamp); break;
    default: d = new Date(timestamp); break;
    //default: return `You need a ten digit timestamp, you sent this ${timestamp}`; break;

  }
  //console.log(d);
  //if (timestamp.toString().length != 10) return `You need a ten digit timestamp, you sent this ${timestamp}`;

  //var d = new Date(timestamp*1000);
  const daysS = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat'];
  const daysL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const monthsS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthsL = ['January','February','March','April','May','June','July','August','Sepember','October','November','December'];
  const dayOfWeek = d.getDay();
  const dayOfMonth = d.getDate();
  const month = d.getMonth();
  const hours = d.getHours();
  const minutes = "0" + d.getMinutes();
  const seconds = "0" + d.getSeconds();
  const newMonth = "0" + ( month+1 );
  const newDayOfMonth = "0" + dayOfMonth;

  //3:05PM
  let time = () => {
    let newHour = hours;
    let meridiem = 'AM';
    if(hours > 12) {
      meridiem = 'PM';
      newHour = hours-12;
    }
    if (newHour === 0) newHour = 12;
    return `${newHour}:${minutes.substr(-2)}${meridiem}`;
  }
  //15:05
  let milTime = () => {return `${hours}:${minutes.substr(-2)}`;}
  //2018
  let year = () => {return d.getFullYear().toString();}
  //08/18/18
  let date = () => {return `${newMonth.substr(-2)}/${newDayOfMonth.substr(-2)}/${year().substr(-2)}`;}
  //18/08/18 3:05PM
  let dateTime = () => {return `${newMonth.substr(-2)}/${newDayOfMonth.substr(-2)}/${year().substr(-2)} ${time()}`;}
  //18/08/18
  let dateBrit = () => {return `${newDayOfMonth.substr(-2)}/${newMonth.substr(-2)}/${year().substr(-2)}`;}
  //August 18, 2018
  let writtenDate = () => {return `${monthsL[month]} ${newDayOfMonth.substr(-2)}, ${year()}`;}
  //Sat 08/18/18
  let short = ()=> {return `${daysS[dayOfWeek]} ${date()}`;}
  //Sat 08/18/18 15:05
  let shortMil = ()=> {return `${daysS[dayOfWeek]} ${date()} ${milTime()}`;}
  //Saturday, August 18, 2018
  let med = ()=> {return `${daysL[dayOfWeek]} ${writtenDate()}`;}
  //Saturday, August 18, 2018 - 3:05PM
  let long = ()=> {return `${daysL[dayOfWeek]} ${writtenDate()} - ${time()}`;}
  //Saturday, August 18, 2018 - 15:05:00
  let vlong = ()=> {return `${daysL[dayOfWeek]} ${writtenDate()} - ${milTime()}:${seconds.substr(-2)}`;}
  //2018-09-02 22:53:00
  let DBdateTime = ()=> {return `${year()}-${newMonth.substr(-2)}-${newDayOfMonth.substr(-2)} ${milTime()}:${seconds.substr(-2)}`}
  //1hr, 5min, 25sec
  let hrsMins = ()=> {
    //console.log ("fu");
    let strA = "";
    let strB = "";
    //let strC = "";
    if (hours === 1) strA = hours + "hr, ";
    else if (hours > 1) strA = hours + "hrs, ";
    if (d.getMinutes() === 1) strB = d.getMinutes() + "min";
    else if (d.getMinutes() > 1) strB = d.getMinutes() + "mins";
    else strA = strA.replace(", ", "");
    //if (d.getSeconds() === 1) strC = d.getSeconds() + "sec";
    //else if (d.getSeconds() > 1) strC = d.getSeconds() + "secs";
    //else strB = strB.replace(", ","");

    return strA + strB;// + strC;
  }

  switch(type){
    case 'vlong': return vlong(); break;
    case 'long': return long();  break;
    case 'med': return med(); break;
    case 'short': return short(); break;
    case 'shortMil': return shortMil(); break;
    case 'day': return daysS[dayOfWeek]; break;
    case 'dayFull': return daysL[dayOfWeek]; break;
    case 'date': return date(); break;
    case 'dateTime': return dateTime(); break;
    case 'dateBrit': return dateBrit(); break;
    case 'year': return year(); break;
    case 'time': return time(); break;
    case 'milTime': return milTime(); break;
    case 'DBdateTime': return DBdateTime(); break;
    case 'hrsMins': return  hrsMins(); break;
    default:
      return `
        Dude, put something as a type...
        formatTime = function (timestamp, type){}

        Example:
        vlong = Saturday, August 18, 2018 - 15:05:00
        long = Saturday, August 18, 2018 - 3:05PM
        med = Saturday, August 18, 2018
        short = Sat 08/18/18
        shortMil = Sat 08/18/18 15:05
        day = Mon
        dayFull = Monday
        date = 08/18/18
        dateTime = 08/18/18 3:05PM
        dateBrit = 18/08/18
        year = 2018
        time = 3:05PM
        milTime = 15:05
        DBdateTime = 2018-09-02 22:53:00
        hrsMins = 1hr, 5min//, 25sec
      `;
    break;
  }
}
