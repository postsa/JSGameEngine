//base drawable class, anything drawn on the screen inherits this.
const Debug = require('./debug.js')
const Globals = require('./globals.js')

class Drawable {
  constructor(world, context, width, height, x, y) {
    this.world = world;
    this.context = context;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }
  //draw method to overload
  draw() { }
}

//
class Collidable extends Drawable{
  constructor(world, context, width, height, x, y, solid) {
    super(world, context, width, height, x, y);
    this.solid = solid;
    this.contactList = [];
  }

  //
  baseOnContactLost(lostWith, i) {
    this.contactList.splice(i, 1);
  }

  //
  onContactLost(lostWith, i) {
    this.baseOnContactLost(lostWith, i);
  }

  //
  baseOnCollision(collidedWith) {
    //if it doesn't exist in the contactList, add it
    if(this.contactList.indexOf(collidedWith) <= -1)
      this.contactList.push(collidedWith);
  }

  //
  onCollison(collidedWith) {
    this.baseOnCollision(collidedWith);
  }
}

//
class Obstacle extends Collidable {
  constructor(world, context, width, height, x, y) {
    super(world, context, width, height, x, y, true) //true b/c solid
  }
  draw() {
    this.context.fillStyle = 'black';
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  onCollision() {
    this.baseOnCollision();
  }

  onContactLost() {
    this.baseOnContactLost();
  }
}

//
class MessageArea extends Collidable {
  constructor(world, context, width, height, x, y, solid, color) {
    super(world, context, width, height, x, y, solid);
    //can't access this in constructor until we call super
    this.color = color; //color is a string (think css)
    this.displayMessage = true;
  }

  //
  draw() {
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  //
  onCollision(collidedWith) {
    this.baseOnCollision(collidedWith);
    if(this.displayMessage
        && collidedWith.constructor.name == "PlayerCharacter") {
      this.color = 'red';
      this.showMessage();
      this.displayMessage = false;
    }
  }

  //
  onContactLost(lostWith, i) {
    this.baseOnContactLost(lostWith, i);
    //do whatever else you need to do
    this.displayMessage = true;
    this.color = 'blue'
  }

  //
  pollForKeyboardInput() {
    if(Globals.KEYS[13]) {
      this.hideMessage();
    }
  }

  //
  showMessage() {
    var messageArea = document.getElementById('message-area');
    messageArea.innerHTML = 'Test Message: Press enter to dismiss.';
  }

  //
  hideMessage() {
    var messageArea = document.getElementById('message-area');
    messageArea.innerHTML = '';
  }
}

//any character that moves extends this class
class Character extends Collidable {
  constructor(world, context, width, height, image, speed, x, y, solid) {
    //super calls the base class constructor
    //super.methodname() calls that method from the base class
    super(world, context, width, height, x, y, solid)
    this.image =  new Image();
    this.image.src = image;
    this.cutX = 0;
    this.cutY = 0;
    this.direction = Globals.DIRECTIONS.RIGHT;
    this.animate = false;
    this.speed = speed;
    this.dialogue = "";
    this.isSpeaking = false;
    this.speechCounter = 0;
    this.speechDuration;
  }

  //draws to canvas context based on the source image and the position
  draw() {
    Debug.updatePositionLogs(this.x, this.y);
    Debug.updateContactLogs(this.contactList);
    this.context.drawImage(this.image, (this.cutX * this.width),
                          (this.height * this.cutY), this.width, this.height,
                          this.x, this.y,
                          this.width, this.height);
    if(this.isSpeaking) {
      if(this.speechCounter <= this.speechDuration) {
        this.context.font = "12px Arial";
        this.context.fillStyle = 'white';
        this.context.fillText(this.dialogue, this.x - 20, this.y - 20);
        this.speechCounter += 1;
      }
      else {
        this.silence();
      }
    }
  }

  speak(dialogue, duration) {
    this.isSpeaking = true;
    this.dialogue = dialogue;
    this.speechDuration = duration;
  }

  silence() {
    this.isSpeaking = false;
    this.speechCounter = 0;
  }

  //move must be overridden if we want to do anything
  move(up, left, right, down, direction) {}
}


//player character that responds to key input
class PlayerCharacter extends Character {
  constructor(world, context, width, height, image, speed, x, y, solid) {
    super(world, context, width, height, image, speed, x, y, solid);
    this.count = 0;
    this.canMoveUp = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;
    this.canMoveDown = true;
    this.canFire = true;
  }

  createProjectile(width, height, speed, color) {

    var p = new Projectile(this.world, this.context, width, height, this.x  - 10, this.y - 10, false,
      this.direction, speed, color);
    return p;
  }

  notifyWorldOfCreation(object, drawable, collidable, polls) {
    this.world.onCreation(object, drawable, collidable, polls);
  }

  allowMovement() {
    this.canMoveUp = true;
    this.canMoveLeft = true;
    this.canMoveRight = true;
    this.canMoveDown = true;
  }

  //
  onCollision(collidedWith) {
    this.baseOnCollision(collidedWith);
    //for debug purposes
    Debug.debugContactList = this.contactList;
    if(collidedWith.solid == true) {
      if(this.direction == Globals.DIRECTIONS.UP) {
        this.canMoveUp = false;
        this.bounce(0, 0, 0, 1);
      }
      if(this.direction == Globals.DIRECTIONS.LEFT) {
        this.canMoveLeft = false;
        this.bounce(0, 0, 1, 0);
      }
      if(this.direction == Globals.DIRECTIONS.RIGHT) {
        this.canMoveRight = false;
        this.bounce(0, 1, 0, 0);
      }
      if(this.direction == Globals.DIRECTIONS.DOWN) {
        this.canMoveDown = false;
        this.bounce(1, 0, 0, 0);
      }
      this.speak("I can't go that way", 60);
    }
    if(collidedWith.constructor.name == 'MessageArea')
      this.speak("What is this?", Number.MAX_SAFE_INTEGER); //has another dialogue close condition
  }

  //
  onContactLost(lostWith, i) {
    this.baseOnContactLost(lostWith, i);
    //for debug purposes
    Debug.debugContactList = this.contactList;
    if(lostWith.solid)
      this.allowMovement();
    if(lostWith.constructor.name == "MessageArea" && this.isSpeaking)
      this.isSpeaking = false;
  }

  adjustToBackground() {
    var test = this.world.tryBackgroundRedraw(this.x, this.y,
      this.width, this.height)
    if(test > -1) { //assuming there is a redraw
      if(test == Globals.DIRECTIONS.UP)
        this.y = 635 - this.width; //have to account for fatness
      if(test == Globals.DIRECTIONS.LEFT)
        this.x = 955 - this.height;
      if(test == Globals.DIRECTIONS.RIGHT ) {
        this.x = 5;
      }
      if(test == Globals.DIRECTIONS.DOWN) {
        this.bounce(0, 0, 0, 1)
        this.y = 5;
      }
    }
  }

  //checks if Globals.KEYS are pressed and if they are, move and animate
  // uses the WASD Globals.KEYS
  // move commands go in as 1 or 0
  //and animate in the direction of direction
  move(up, left, right, down, direction) {
      //need a way to stop the character from walking off the screen
      this.adjustToBackground();
      this.animate = true;
      if(this.canMoveLeft) this.x -= (left * this.speed);
      if(this.canMoveRight) this.x += (right * this.speed);
      if(this.canMoveDown) this.y += (down * this.speed);
      if(this.canMoveUp) this.y -= (up * this.speed);
      this.direction = direction;
      this.setAnimationFrame();
      //at some point have to turn off animation
  }

  //an imperceptable move that clears collisions and doesnt check flags
  bounce(up, left, right, down) {
    this.x -= (left * 2);
    this.x += (right * 2);
    this.y += (down * 2);
    this.y -= (up * 2);
  }

  //figure out where on the spritesheet to animate from
  setAnimationFrame() {
        if(!this.animate)
          return;
        //set yImage based on direction for most sprites
        this.cutY = this.direction;
        if(this.count % 15 == 0) { // Every 15 movement frames (frame group) cycle through sprites
          if (this.count == 0){ // Begin cycle at sprite 2
            this.cutX = 0;
          }
          else if (this.count == 15){ // Go to next sprite for 3 frame groups
            this.cutX = 1;
          }
          else if (this.count == 30){ // Go to previous sprite for 2 frame groups
            this.cutX = 2;
            this.count = -1;
          }
        }
        this.count++;

    }

  fireProjectile() {
    if(this.canFire) {
      var p = this.createProjectile(5, 5, 8, 'red');
      this.notifyWorldOfCreation(p, 1, 1, 0);
    }
  }

  //
  pollForKeyboardInput() {
      //need a smarter way to poll for input where we can ready
      //all the keys at a time without doing a million if else blocks
      if (Globals.KEYS[65]) // Go Left
      {
        this.move(0, 1, 0, 0, Globals.DIRECTIONS.LEFT)
      }
 		  else if (Globals.KEYS[68]) // Go Right 39
      {
        this.move(0, 0, 1, 0, Globals.DIRECTIONS.RIGHT)
      }
      else if (Globals.KEYS[87]) // Go Up
      {
        this.move(1, 0, 0, 0, Globals.DIRECTIONS.UP);
      }
      else if (Globals.KEYS[83]) // Go Down
      {
        this.move(0, 0, 0, 1, Globals.DIRECTIONS.DOWN);
      }
      if(Globals.KEYS[75])
      {
        this.fireProjectile();
        this.canFire = false;
      }
      else if(!Globals.KEYS[75])
      {
        this.canFire = true;
      }
      else
      {
        this.animate = false;
      }
    }
}

//
class Projectile extends Collidable {
  constructor(world, context, width, height, x, y, solid, direction, speed, color) {
    super(world, context, width, height, x, y, solid);
    this.direction = direction;
    this.speed = speed;
    this.color = color;
  }

  move() {
    switch(this.direction) {
      case Globals.DIRECTIONS.UP:
        this.y -= this.speed;
        break;
      case Globals.DIRECTIONS.LEFT:
        this.x -= this.speed;
        break;
      case Globals.DIRECTIONS.RIGHT:
        this.x += this.speed;
        break;
      case Globals.DIRECTIONS.DOWN:
        this.y += this.speed;
        break;
    }

  }

  onCollision(collidedWith) {
    this.baseOnCollision(collidedWith);
      if(collidedWith.solid == true) {
        this.world.onRemoval(this);
      }
    }

  draw() {
    this.move(); //projectiles always move
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

//
class Destructable extends Collidable {
  constructor(world, context, width, height, x, y, solid) {
    super(world, context, width, height, x, y, solid);
  }

  onCollision(collidedWith) {
    this.baseOnCollision(collidedWith);
    if(collidedWith.constructor.name == "Projectile") {
      this.world.onRemoval(this);
    }
  }

  draw() {
    this.context.fillStyle = 'purple';
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }
}

module.exports = {PlayerCharacter : PlayerCharacter,
                  Obstacle : Obstacle, MessageArea : MessageArea,
                  Destructable : Destructable}
