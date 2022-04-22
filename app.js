const express = require('express');
const fs = require('fs');
var bodyParser = require('body-parser');
const app = express();
repeatTimeout();

function repeatTimeout() {
  clearLog();
  setTimeout(repeatTimeout, msToMidnight());
};

function clearLog() {
  fs.writeFile('./roster.txt', "", err => {
    if (err) {
      console.error(err)
    }
  });
};

function msToMidnight() {
  var now = new Date();
  var then = new Date(now);
  then.setHours(24, 0, 0, 0);
  return (then - now);
}

var urlencodedParser = bodyParser.urlencoded({ extended: false })
    
app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/roster', (req, res) => {
  fs.readFile('./roster.txt', (err, data) => {
    if (err) {
      console.log(err)
    }
    res.send(data.toString());
  })
});
    
app.post('/home', urlencodedParser, (req, res) => {
    console.log('New Player:', req.body.player_name);
    const data = req.body.player_name + '\n';

    fs.appendFile('./roster.txt', data, err => {
      if (err) {
        console.error(err)
        return
      }
      //done!
    });

    res.sendFile(__dirname + '/index.html');
});

app.get('/', urlencodedParser, (req,res) => {
  res.sendFile(__dirname + "/login.html");
});

app.post('/', urlencodedParser, (req,res) => {
  if (req.body.password === "cogbuut") {
    res.sendFile(__dirname + "/index.html");
  } else {
    res.sendFile(__dirname + "/login.html")
  }
});
    
app.listen(8080);