const Globals = require('./globals.js')

class BackgroundManager {
  constructor(context, screenWidth, screenHeight) {
    this.context = context;
    this.image = ''; //no image set by default
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.x = 0;
    this.y = 0;
    this.cutX = 0;
    this.cutY = 0;
  }

  //
  drawBackground() {
      //draw the background image to the screen, must be drawn before
      //anything else
    if(this.image) {
      this.context.drawImage(this.image, this.cutX * this.screenWidth,
                            this.cutY * this.screenHeight, this.screenWidth,
                            this.screenHeight, 0, 0,
                            this.screenWidth, this.screenHeight);
    }
  }

  //set the background image
  setBackgroundImage(image) {
    this.image =  new Image();
    this.image.src = image;
  }

  tryRedraw(charX, charY, charWidth, charHeight) {
    if(charX == 0)
      if (this.cutX > 0) {
        this.cutX -= 1;
        return Globals.DIRECTIONS.LEFT;
      }
    if (charY == 0)
      if (this.cutY > 0) {
        this.cutY -= 1;
        return Globals.DIRECTIONS.UP;
      }
    if (charX + charWidth >= 960) {
      this.cutX += 1;
      return Globals.DIRECTIONS.RIGHT;
    }
    if (charY + charHeight >= 640) {
      this.cutY += 1;
      return Globals.DIRECTIONS.DOWN;
    }
    return -1;
  }

}
module.exports = BackgroundManager;
