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
console.log();
console.log(utils.formatTime(utils.timestamp(), argv.type));
console.log();
