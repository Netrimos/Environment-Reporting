const yargs = require('yargs');
const utils = require('./format');

const argv = yargs
  .options({
    t:{
      demand: true,
      alias: 'type',
      describe: `vlong = Saturday, August 18, 2018 - 15:05:00
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
      hrsMins = 1hr, 5min
      `,
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

console.log(utils.timestamp());
console.log(utils.createGUID());
console.log(utils.toTimestamp("08/18/2018 15:05:53"));
var d = new Date("2018-09-05T13:21:00.000Z");
console.log("MySQL DATE " + utils.formatTime(d.getTime(), argv.type));
console.log(utils.timeDifference(utils.toTimestamp("23:59:59"),utils.toTimestamp("22:48:58"),"string"));
console.log(utils.timeDifference(utils.toTimestamp("23:59:00"),utils.toTimestamp("21:57:00"),"string"));
console.log(utils.timeDifference(utils.toTimestamp("23:59:59"),utils.toTimestamp("22:58:57"),"time"));
console.log(utils.timeDifference(utils.toTimestamp("23:59:59"),utils.toTimestamp("22:58:58"),"min"));
console.log(utils.formatTime(utils.timestamp(), argv.type));
console.log();
test = new Date("08/18/2018 15:11:00");
console.log(utils.formatTime("0000007200", "hrsMins"));
console.log(utils.formatTime(utils.toTimestamp("08/18/2018 15:11:00"), "hrsMins"));
console.log(utils.formatTime(utils.toTimestamp("08/18/2018 01:01:01"), "hrsMins"));
