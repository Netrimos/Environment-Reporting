const yargs = require('yargs');
const utils = require('./format');

const argv = yargs
  .options({
    t:{
      demand: true,
      alias: 'type',
      describe: 'type of DateTime',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

console.log(utils.timestamp());
console.log(utils.createGUID());
console.log(utils.toTimestamp("08/18/2018 15:05:53"));
console.log(utils.timeDifference(utils.toTimestamp("23:59:59"),utils.toTimestamp("22:48:58"),"string"));
console.log(utils.timeDifference(utils.toTimestamp("23:59:00"),utils.toTimestamp("21:57:00"),"string"));
console.log(utils.timeDifference(utils.toTimestamp("23:59:59"),utils.toTimestamp("22:58:57"),"time"));
console.log(utils.timeDifference(utils.toTimestamp("23:59:59"),utils.toTimestamp("22:58:58"),"min"));
console.log(utils.formatTime(utils.timestamp(), argv.type));
console.log();
