var express = require("express");

let konamiRoom = require("./konami.js");
let morseRoom = require("./morse.js");

/////////////////////////////////

const app = express();
var expressWs = require('express-ws')(app);
var router = express.Router();
var socket = null;

app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.static('static'));

  console.log("express")
 
app.ws('/echo', function(ws, req) {
  console.log("echo connect");
  socket = ws;
  ws.on('message', function(msg) {
    console.log("message recv:"+msg)
    let obj = JSON.parse(msg);
    
    console.log(obj)
    
    if (obj.type && obj.type === "room") {
      
    
      if (obj.room === "konami") { 
        konamiRoom.setup();
        konamiRoom.setCallback(function(){
          console.log("konami server success");
          ws.send("hello from server konami");
          });
      }
      
      
      if (obj.room === "morse") { 
        morseRoom.setup();
        morseRoom.setCallback(function(){
          console.log("morse server success");
          ws.send("hello from server morse");
          });
      }
    }
    
    if (obj.type && obj.type === "answer") {

      if (obj.room === "morse") {
        if (obj.answer === "HACK") {
          morseRoom.success();
        }
      }

      if (obj.room === "password") {
        if (obj.answer === "adminadmin") {
          passwordRoomSuccess();
        }
      }
      
      
    }
    
    
    
  });
});



var request = require('request');

open_door = function() {
  

  request('http://192.168.2.100/ON', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body);
          sendData({payload: "konami code!"});
       }
  })
  
}


app.listen(3000, () => console.log('Example app listening on port 3000!'));