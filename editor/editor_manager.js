const Globals = require('../engine/globals') //probly in the wrong place
const WorldAttributes = require('../engine/world_attributes')
const Drawables = require('../engine/drawable_classes')

class EditorManager {
  constructor(world) {
    this.world = world;
    self = this
    this.editorPanel = document.getElementById('editor-panel');
    this.panelDisplayed = false;
    this.canSwitch = true;
    this.addListeners();
  }

  //
  displayEditorPanel() {
    this.editorPanel.style.display = "block";
    this.panelDisplayed = true;
  }

  addListeners() {
    this.createAddDestructableListener();
  }

  createAddDestructableListener() {
    document.getElementById("add-destructable").addEventListener("click", function(){
      var width = parseInt(document.getElementById('destructable-width').value)
      var height = parseInt(document.getElementById('destructable-height').value)
      var x = parseInt(document.getElementById('destructable-x').value)
      var y = parseInt(document.getElementById('destructable-y').value)
      self.addDestructable(width, height, x, y)
    });
  }

  //
  addDestructable(width, height, x, y) {
    var d = new Drawables.Destructable(this.world, WorldAttributes.Context,
      width, height, x, y, true);
    WorldAttributes.Renderer.addDrawable(d);
    WorldAttributes.CollisionResolver.addCollidable(d);
  }



  //
  hideEditorPanel() {
    this.editorPanel.style.display = "none";
    this.panelDisplayed = false;
  }

  //
  pollForEditorInput() {
    if(Globals.KEYS[69] && this.canSwitch) {
      this.canSwitch = false;
      if(!this.panelDisplayed )
        this.displayEditorPanel()
      else
        this.hideEditorPanel()
      }
    else if(!Globals.KEYS[69])
      this.canSwitch = true;
  }


}

module.exports = EditorManager;
