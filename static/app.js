const button = document.querySelector('button');

button.addEventListener('click', function(event) {
  // Call navigator.bluetooth.requestDevice
  
  
  navigator.bluetooth.requestDevice({ filters: [{ services: ['indoor_positioning', 'human_interface_device'] }] })
    .then(device => { console.log(device) })
    .catch(error => { console.log(error); });

});


var exampleSocket = new WebSocket("ws://localhost:3000/echo");


exampleSocket.onmessage = function (event) {
  console.log("onmessage",event.data);
}

exampleSocket.onopen = function (event) {
  console.log("socket onopen");
  exampleSocket.send("Here's some text that the server is urgently awaiting!"); 
};
// exampleSocket.send("hoi");