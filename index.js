var gamepad = require("gamepad");
var express = require("express");

// Listen for attach events on all gamepads
gamepad.on("attach", function (id, state) {
  console.log("attach", {id, state});
});

// Initialize the library
gamepad.init()

sendData = function(obj) {
  socket && socket.send(JSON.stringify(obj));
}

let konami_code = [
  {"verb":"down","id":0,"num":0},
  {"verb":"up","id":0,"num":0},
  {"verb":"down","id":0,"num":2},
  {"verb":"up","id":0,"num":2},
  {"verb":"down","id":0,"num":3},
  {"verb":"up","id":0,"num":3},
  {"verb":"down","id":0,"num":1},
  {"verb":"up","id":0,"num":1}
];
current_index = 0;

process_input = function( obj) {
  
  equalKeypress = function(obj1, obj2) {
    return !!(
      "verb" in obj1 && "id" in obj1 && "num" in obj1 &&
      "verb" in obj2 && "id" in obj2 && "num" in obj2 &&
      obj1.verb === obj2.verb && obj1.id === obj2.id && obj1.num === obj2.num);
  }
  
  console.log("current_index", current_index );
  console.log("current_kon", konami_code[current_index] );
  console.log("current_key", obj );
  if (!!konami_code[current_index] && equalKeypress(obj, konami_code[current_index])) {
    console.log("equal" );
    
    current_index = current_index +1;
    console.log("idx & length", current_index, konami_code.length, current_index >= konami_code.length);  
    if (current_index >= konami_code.length) {
      sendData({payload: "konami code!"});
      current_index = 0;
    }
  } else {
    current_index = 0;
  }
}


// List the state of all currently attached devices
for (var i = 0, l = gamepad.numDevices(); i < l; i++) {
  console.log(i, gamepad.deviceAtIndex(i));
  controller = gamepad.deviceAtIndex(i);
}

// Create a game loop and poll for events
setInterval(gamepad.processEvents, 16);
// Scan for new gamepads as a slower rate
// setInterval(function(){console.log("detect");gamepad.detectDevices}, 500);
gamepad.detectDevices();

// Listen for move events on all gamepads
gamepad.on("move", function (id, axis, value) {
  // console.log("move", );
  
    let obj = {
    verb: "move",
    id: id,
    axis: axis,
    value: value,
  }
  // console.log("mv", obj, Date.now()); 
    process_input(obj);
});

// Listen for button up events on all gamepads
gamepad.on("up", function (id, num) {
  let obj = {
    verb: "up",
    id: id,
    num: num,
  }
  process_input(obj);
});

// Listen for button down events on all gamepads
gamepad.on("down", function (id, num) {
  let obj = {
    verb: "down",
    id: id,
    num: num,
  }
  process_input(obj);
});

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
    ws.send(msg);
  });
});
 
// app.use("/ws-stuff", router);


app.listen(3000, () => console.log('Example app listening on port 3000!'))