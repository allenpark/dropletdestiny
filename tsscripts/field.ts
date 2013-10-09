var field_md;

class Field {
  width:  number = 32; // TODO: Find the right number.
  height: number = 500; // TODO: Find the right number.
  droplets: Droplet[] = [];
  obstacles: Obstacle[] = [];
  stageWidth: number;
  stageHeight: number;
  
  constructor(graphicsDevice, mathDevice, canvasX, canvasY, droplets, obstacles) {
    field_md = mathDevice;
    this.droplets = droplets;
    this.obstacles = obstacles;
    this.stageWidth = canvasX;
    this.stageHeight = canvasY;
  }

  draw(draw2D) {
    for (var i = 0; i < this.droplets.length; i++) {
      this.droplets[i].draw(draw2D);
    }
    for (var i = 0; i < this.obstacles.length; i++) {
      this.obstacles[i].draw(draw2D);
    }
  }

  update() {
    // TODO: fill in
  }
}
