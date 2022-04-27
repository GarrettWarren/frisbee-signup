const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const res = require('express/lib/response');
const roster = [];
var forcast = "";
repeatTimeout();

function repeatTimeout() {
  //this runs on startup, but we only only want to reset when msToMidnight==0
  if (msToMidnight() < 60000){ 
    clearRoster();
  }
  setTimeout(repeatTimeout, msToMidnight());
};

function msToMidnight(){
  diff = new Date().setHours(24,0,0,0) - Date.now()
  return diff
}

var jsonencodedParser = bodyParser.json({ extended: false })
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/roster', (req, res) => {
  // read();
  res.send(roster.toString());
});
    
app.post('/add', jsonencodedParser, (req, res) => {
    let name = req.body.player_name
    if (!roster.includes(name)) {
      console.log('New Player:', name);
      roster.push(name);
      // write();
    }
    res.sendFile(__dirname + '/index.html');
});

app.post('/delete', jsonencodedParser, (req, res) => {
  let name = req.body.player_name
  if (name === "deleteall") {
    clearRoster();
  } else {
    const index = roster.indexOf(name);
    if (index > -1) {
      roster.splice(index, 1);
      console.log('Removed Player:', name);
      // write();
    }
  }
  res.sendFile(__dirname + '/index.html');
});
    

function clearRoster(){
  roster.length=0;
  roster.push("rosterheader")
  write();
}


function write(){
  const execSync = require("child_process").execSync;
  let execString = "python ./dbx_io.py write "+roster.toString();
  const result = execSync(execString);
  console.log("write");
  console.log(roster.toString());
};

function read(){
  const execSync = require("child_process").execSync;
  const result = execSync('python ./dbx_io.py read');
  console.log("read")
  console.log(result.toString())
  result.toString().split(",").forEach(function (playerName) {
    let trimmedName = playerName.trim()
    if (!roster.includes(trimmedName)){
      roster.push(trimmedName);
    }
  });
}


app.listen(process.env.PORT || 5050, function () {
  read();
});



process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'));

  function shutdown(signal) {
    return (err) => {
      write();
      console.log(`${ signal }...`);
      process.exit();
    };
  }
