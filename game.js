const electron = require('electron');
const CollisionResolver = require('./engine/collision_resolver.js')
const InputHandler = require('./engine/input_handler.js')
const Drawables = require('./engine/drawable_classes.js')
const Debug = require('./engine/debug.js')
const World = require('./engine/world.js')
const WorldAttributes = require('./engine/world_attributes.js')

//get the canvas from the html
var world = new World.World('canvas');


//if it's a world attribute, why not draw by the world;
WorldAttributes.BackgroundManager.setBackgroundImage('static/images/CastleExample.png');

//lets create our character from the sprite sheet
var character = new Drawables.PlayerCharacter(world, WorldAttributes.Context, 32, 32,
  'static/images/test_sprite.png', 1, 0, 0, true, world);
var ma = new Drawables.MessageArea(world, WorldAttributes.Context, 20, 20,
  500, 500, false, 'blue');
var barrier = new Drawables.Obstacle(world, WorldAttributes.Context, 20, 250,
  300, 200);
var barrier2 = new Drawables.Obstacle(world, WorldAttributes.Context, 200, 20,
  250, 350);

var d1 = new Drawables.Destructable(world, WorldAttributes.Context, 20, 20, 100, 100, true);
var d2 = new Drawables.Destructable(world, WorldAttributes.Context, 40, 20, 400, 100, true);
var d3 = new Drawables.Destructable(world, WorldAttributes.Context, 20, 50, 200, 300, true);

//here we go with this same idea for collisions, drawing, and keyboard input polling
WorldAttributes.InputHandler.addPoller(character);
WorldAttributes.InputHandler.addPoller(ma);

//whoever is added second gets their draw method called second and is therefore drawn on top
WorldAttributes.Renderer.addDrawable(ma);
WorldAttributes.Renderer.addDrawable(barrier);
WorldAttributes.Renderer.addDrawable(barrier2);
WorldAttributes.Renderer.addDrawable(character);
WorldAttributes.Renderer.addDrawable(d1);
WorldAttributes.Renderer.addDrawable(d2);
WorldAttributes.Renderer.addDrawable(d3);

//order won't matter too much here, whoever is added second gets their collision method
//called second
WorldAttributes.CollisionResolver.addCollidable(ma);
WorldAttributes.CollisionResolver.addCollidable(character);
WorldAttributes.CollisionResolver.addCollidable(barrier);
WorldAttributes.CollisionResolver.addCollidable(barrier2);
WorldAttributes.CollisionResolver.addCollidable(d1);
WorldAttributes.CollisionResolver.addCollidable(d2);
WorldAttributes.CollisionResolver.addCollidable(d3);


world.initWorld();
