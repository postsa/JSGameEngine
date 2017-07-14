class Renderer {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.width = width;
    this.height = height;
    this.drawables = []
  }

  //
  initCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.backgroundColor = this.color;
  }

  //
  clearCanvas() {
    this.context.clearRect(0, 0, this.width, this.height, this.color);
  }

  //
  addDrawable(d) {
    this.drawables.push(d);
  }

  //
  removeDrawable(d) {
    var i = this.drawables.indexOf(d)
    if(i > -1)
      this.drawables.splice(i, 1)
  }

  //
  draw() {
    this.drawables.forEach(function(d) {
      d.draw();
    })
  }
}


module.exports = Renderer;
