//adds the key even listeners when it's constructed
const Debug = require('./debug.js')

class InputHandler {
  constructor() {
    //
    this.pollers = [];
    //
    window.addEventListener('keydown', function (e) {
 		  KEYS =(KEYS || []); //Boolean array of which keys are down
 		  KEYS[e.keyCode] = true;
      Debug.updateKeysPressedLogs(e.keyCode, 0);
 	  })
 	  window.addEventListener('keyup', function (e) {
 		  KEYS[e.keyCode] = false;
      Debug.updateKeysPressedLogs(e.keyCode, 1);
 	  })
  }

  //
  addPoller(p) {
    this.pollers.push(p);
  }

  //
  removePoller(p) {
    var i = this.pollers.indexOf(p)
    if(i > -1)
      this.pollers.splice(i, 1)
  }

  //
  pollForKeyboardInput() {
      this.pollers.forEach(function(p) {
          p.pollForKeyboardInput();
      });
      //up, left, right, down, direction (for animation)
    //controllables must have a move command
  }
}

module.exports = InputHandler;
