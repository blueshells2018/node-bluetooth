  
  var request = require('request');
  
  function handler (error, response, body) {
      if (!error && response.statusCode == 200) {
          // console.log(body);
          // sendData({payload: "konami code!"});
       }
  }
  
  let intervalObject = null;
  function setup(){
    let morseTimings = [200,200,200,200,200,200,200,600, 200,200,400,600, 400,200,200,200,400,200,200,600, 400,200,200,200,400,1200];
    let interval = 100;
    let time = 0, idx = 0, state = false;
    let nextTarget = morseTimings[0];
    function step () {
      time = time + interval;
            // console.log("step", interval, time);
      if (time > nextTarget) {
            // console.log("nextTarget", nextTarget);
        
        // fix next target, idx
        if (idx < morseTimings.length) {        
          nextTarget = nextTarget + morseTimings[idx];
          // fix state
          if (state) {
            request('http://192.168.2.108/SOFF', handler)  
            // console.log("off");
          } else {
            // console.log("on");
            request('http://192.168.2.108/SON', handler)  
          }
          state = !state;
          idx = idx + 1;
        } else {
          nextTarget = morseTimings[0];
          idx = 0;
          time = 0;
          state = false;
        }
        
      }
    }
    
    
    intervalObject = setInterval(step, interval);
    
  }
  function success() {
  console.log("morse success");
    clearInterval(intervalObject);
    request('http://192.168.2.108/SOFF', handler)  
    callback();
  }
  
  
function setCallback (fn){
  console.log("morse setcallback");
  callback = fn;
}
  
module.exports = {
  setup : setup,
  success : success,
  setCallback : setCallback
}