class Field {
  width:  number = 32; // TODO: Find the right number.
  height: number = 500; // TODO: Find the right number.
  droplets: Droplet[] = [];
  obstacles: Obstacle[] = [];
  stageWidth: number;
  stageHeight: number;
  speed: number;
  gd: GraphicsDevice;
  md: MathDevice;
  
  constructor(graphicsDevice, mathDevice, canvasX, canvasY, droplets, obstacles) {
    //droplet_md = mathDevice;
    this.gd = graphicsDevice;
    this.md = mathDevice;
    this.droplets = droplets;
    this.obstacles = obstacles;
    this.stageWidth = canvasX;
    this.stageHeight = canvasY;
    this.speed = 1.0
  }

  private isInBounds(object){
    if(object.y < 0 || object.y > this.stageHeight || object.x < 0 || object.x > this.stageWidth){
      return false;
    }
    return true;
  }

  draw(draw2D) {
    for (var i = this.droplets.length - 1; i >= 0; i--) {
      this.droplets[i].draw(draw2D);
    }
    for (var i = this.obstacles.length - 1; i >= 0; i--) {
      this.obstacles[i].draw(draw2D);
    }
  }

  addDroplet() {
    this.droplets.push(new Droplet(this.gd, this.md, Math.random()*100, 350, 5, this.speed));
  }

  addObstacle() {
    this.obstacles.push(new Obstacle(this.gd, this.md, Math.random()*100, 350, -50, this.speed));
  }

  update(time) {
    //update object positions and remove those that are out of bounds
    for (var i = this.droplets.length - 1; i >= 0; i--) {
      this.droplets[i].updatePosition(time);
      if (!this.isInBounds(this.droplets[i])){
        this.droplets.splice(i,1);
      }
    }
    for (var i = this.obstacles.length - 1; i >= 0; i--) {
      this.obstacles[i].updatePosition(time);
      if (!this.isInBounds(this.obstacles[i])){
        this.obstacles.splice(i,1);
      }
    }
    if (time % 32 == 0) {
      this.addObstacle();
    }
    //if (time % 60 == 0) {
    //  this.addDroplet();
    //}
  }
}
