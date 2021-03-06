const restify = require('restify');
const server = restify.createServer({ name : 'AllyEnv Reporting Server'});
const readData = require('./queries/read');
const addData = require('./queries/create');
const addBulk = require('./queries/addBulk');
const delData = require('./queries/delete');
const port = process.env.PORT || 5001;

//Add configs to Server
server.use((req,res,next) => {
  console.log(req.method + ' ' + req.url);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});
server.use(restify.plugins.bodyParser());

//Route Management
server.get('/', (req, res, next)=>{
  res.send(200, 'Welcome to Ally Reports!');
});
//server.get('/commLog', ()=>{console.log("here")});
server.get('/commLog', readData.getCommLog);
server.get('/commLogTopLevel', readData.getCommLogTopLevel);
server.get('/commLogLatest', readData.getCommLogLatest);
server.get('/commLog/:id', (req, res, next)=>{readData.getCommLogById(req.params, res, next) });
server.get('/commLogDetail/:id', (req, res, next)=>{ readData.getCommLogDetailsById(req.params, res, next)});
server.get('/planned', readData.getPlanned);
server.get('/plannedTopLevel', readData.getPlannedTopLevel);
server.get('/plannedDetail/:id', (req, res, next)=>{ readData.getPlannedDetailsById(req.params, res, next)});
server.get('/followUp', readData.getFollowup);
server.get('/latestStatus', readData.getLatestCompiledStatus);
server.get('/latestStatus/:id', (req, res, next)=>{ readData.getCompiledStatusById(req.params, res, next)});

server.post('/add/commLog', addData.addComLog);
server.post('/add/comStatus', addData.addComStatus);
server.post('/add/plannedOutage', addData.addPlannedOutage);

server.post('/add/bulk/plannedOutage', addBulk.plannedOutage);
server.post('/add/bulk/commLog', addBulk.commLog);



server.del('/delComm', delData.removeCommunicationById);

//Open Server and Port
server.listen(port, () =>{
  console.log(`Report API running on ${port}`);
});
