
module.exports.timestamp = () => { return Math.floor(Date.now() / 1000); }

module.exports.toTimestamp = (strDate) => {
   var datum = Date.parse(strDate);
   return datum/1000;
   // accepts 08/18/2018 15:05:53
   // accepts August 18, 2018 15:05:53"
}

module.exports.createGUID = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports.formatTime = (timestamp, type) => {
  let d;
  switch(timestamp.toString().length){
    case 10: d = new Date(timestamp*1000); break;
    case 13: d = new Date(timestamp); break;
    default: return `You need a ten digit timestamp, you sent this ${timestamp}`; break;

  }
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

  switch(type){
    case 'vlong': return vlong(); break;
    case 'long': return long();  break;
    case 'med': return med(); break;
    case 'short': return short(); break;
    case 'shortMil': return shortMil(); break;
    case 'date': return date(); break;
    case 'dateTime': return dateTime(); break;
    case 'dateBrit': return dateBrit(); break;
    case 'year': return year(); break;
    case 'time': return time(); break;
    case 'milTime': return milTime(); break;
    case 'DBdateTime': return DBdateTime(); break;
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
        date = 08/18/18
        dateTime = 08/18/18 3:05PM
        dateBrit = 18/08/18
        year = 2018
        time = 3:05PM
        milTime = 15:05
        DBdateTime = 2018-09-02 22:53:00
      `;
    break;
  }
}
