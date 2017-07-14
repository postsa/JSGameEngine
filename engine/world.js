const InputHandler = require('./input_handler.js')
const CollisionResolver = require('./collision_resolver.js')
const Renderer = require('./renderer.js')
const Debug = require('./debug.js')
const BackgroundManager = require('./background_manager.js')
const WorldAttributes = require('./world_attributes.js')
const Globals = require('./globals.js')
const EditorManager = require('../editor/editor_manager.js')

class World {
  constructor(canvasId) {
    WorldAttributes.Canvas = document.getElementById(canvasId)
    WorldAttributes.Context = WorldAttributes.Canvas.getContext('2d');
    WorldAttributes.Renderer = new Renderer(WorldAttributes.Canvas, 960, 640, 'white');
    WorldAttributes.InputHandler = new InputHandler();
    WorldAttributes.CollisionResolver = new CollisionResolver();
    WorldAttributes.BackgroundManager = new BackgroundManager(WorldAttributes.Context,
       960, 640) //screenwidth and height should be constant world atts
    WorldAttributes.EditorManager = new EditorManager(this); //borders on spaghetti
  }

  //
  initWorld() {
    WorldAttributes.Renderer.initCanvas();
    drawNextFrame();
  }

  //
  onCreation(object, isDrawable, isCollidable, pollsForInput) {
    this.addObject(object, isDrawable, isCollidable, pollsForInput);
  }

  //
  onRemoval(object) {
    this.removeAllTraceOfObject(object);
  }

  //
  addObject(object, isDrawable, isCollidable, pollsForInput) {
    if(isDrawable)
      WorldAttributes.Renderer.addDrawable(object);
    if(pollsForInput)
      WorldAttributes.InputHandler.addPoller(object);
    if(isCollidable)
      WorldAttributes.CollisionResolver.addCollidable(object);
  }

  //
  removeAllTraceOfObject(object) {
    //these methods are smart enough not to delete the object if it
    //doesnt exist so delete from all lists
    WorldAttributes.Renderer.removeDrawable(object);
    WorldAttributes.InputHandler.removePoller(object);
    WorldAttributes.CollisionResolver.removeCollidable(object);
  }

  //
  tryBackgroundRedraw(charX, charY, charWidth, charHeight) {
    var test = WorldAttributes.BackgroundManager.tryRedraw(charX, charY,
      charWidth, charHeight);
    return test; //-1 if no redraw
  }
}

function drawNextFrame() {
  WorldAttributes.Renderer.clearCanvas();
  WorldAttributes.BackgroundManager.drawBackground(); //doesnt do anything if image not set
  WorldAttributes.Renderer.draw();
  WorldAttributes.InputHandler.pollForKeyboardInput();
  WorldAttributes.EditorManager.pollForEditorInput();
  WorldAttributes.CollisionResolver.detectCollisions();
  window.requestAnimationFrame(drawNextFrame);

}

module.exports = {World: World, Renderer : Renderer,
          InputHandler : InputHandler, CollisionResolver : CollisionResolver}
