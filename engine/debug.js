let debugKeysPressed = [];

//
var debugLogCharX = document.getElementById('char-x');
var debugLogCharY = document.getElementById('char-y');
var debugLogContactList = document.getElementById('contact-list');
var debugKeysPressedList = document.getElementById('keys-pressed-list');
//
function updatePositionLogs(charX, charY) {
  debugLogCharX.innerHTML = "Character x: " + charX;
  debugLogCharY.innerHTML = "Character y: " + charY;
}

//
function updateContactLogs(debugContactList) {
  debugLogContactList.innerHTML = '';
  var node = document.createElement("li");
  var textNode = document.createTextNode("Count: " + debugContactList.length);
  node.appendChild(textNode);
  debugLogContactList.appendChild(node);
  debugContactList.forEach(function(c) {
    var node = document.createElement("li");
    var textNode = document.createTextNode(c.constructor.name);
    node.appendChild(textNode);
    debugLogContactList.appendChild(node);
  });
}

//
function updateKeysPressedLogs(k, remove) {
  if(!remove) {
    if(!(debugKeysPressed.indexOf(k) > -1))
    debugKeysPressed.push(k);
  }
  else {
    //remove the element from the array
    debugKeysPressed.splice(debugKeysPressed.indexOf(k), 1);
  }
  debugKeysPressedList.innerHTML = '';
    debugKeysPressed.forEach(function(k) {
      var node = document.createElement("li");
      var textNode = document.createTextNode(k);
      node.appendChild(textNode);
      debugKeysPressedList.appendChild(node);
    })
}



module.exports = {updatePositionLogs : updatePositionLogs,
  updateContactLogs : updateContactLogs,
  updateKeysPressedLogs : updateKeysPressedLogs,
  debugKeysPressed : debugKeysPressed}
