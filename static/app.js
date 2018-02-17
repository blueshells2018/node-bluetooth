

// document.body.append(window.location);
var URL = "ws://"+window.location.hostname+":"+window.location.port+"/echo";
var exampleSocket = new WebSocket(URL);
// var exampleSocket = new WebSocket("ws://localhost:3000/echo");


exampleSocket.onmessage = function (event) {
  console.log("onmessage",event.data);
  document.body.append(event.data);
}

exampleSocket.onopen = function (event) {
  console.log("socket onopen");
  
  
  exampleSocket.send(JSON.stringify(roommsg)); 
};
// exampleSocket.send("hoi");