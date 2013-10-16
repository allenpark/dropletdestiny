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
  pd: Physics2DDevice;
  world: Physics2DWorld;
  id: number = 0;

  constructor(graphicsDevice, mathDevice, phys2D, canvasX, canvasY, droplets, obstacles, world) {
    //droplet_md = mathDevice;
    this.gd = graphicsDevice;
    this.md = mathDevice;
    this.pd = phys2D;
    this.droplets = droplets;
    this.obstacles = obstacles;
    this.stageWidth = canvasX;
    this.stageHeight = canvasY;

    this.speed = 1.0;
    this.world = world;
    for(var i = 0; i < droplets.length; i++){
       this.world.addRigidBody(this.droplets[i].getRigidBody())
    }

    for(var i = 0; i < obstacles.length; i++){
       this.world.addRigidBody(this.obstacles[i].getRigidBody())
    }

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

  addDroplet(time) {
    this.droplets.push(new Droplet(this.gd, this.md, this.pd, Math.random()*100, 350, 5, this.speed, time));
    this.world.addRigidBody(this.droplets[this.droplets.length-1].getRigidBody());
  }

  removeDroplet(id) {
    for (var i = 0; i < this.droplets.length; i++){
      if (this.droplets[i].id == id) {
        return this.droplets.splice(i,1)[0];
      }
    }
  }

  addObstacle() {
    this.obstacles.push(new Obstacle(this.gd, this.md, this.pd, Math.random()*100, 350, -50, this.speed));
    this.world.addRigidBody(this.obstacles[this.obstacles.length-1].getRigidBody());
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

    //var droplet = new Droplet(this.gd, this.md, this.pd, /*sprite,*/ 100, 200, 5, this.speed);
    //this.droplets.push(droplet)
    //this.world.addRigidBody(droplet.getRigidBody())
    //console.log(this.droplets.length)

    if (time % 80 == 0) {
      this.addObstacle();
    }

    if (time % 60 == 0) {
      this.addDroplet(time);
    }

  }
}
