class Droplet {
  body: any;
  sprite: Draw2DSprite;
  x: number;
  y: number;
  points: number;
  speed: number;
  width:  number = 32; 
  height: number = 32;
  
  constructor(graphicsDevice, mathDevice, phys2D, /*sprite,*/ x, y, points, speed) {
    this.x = x;
    this.y = y;
    this.sprite = Draw2DSprite.create({
        width:  32,
        height: 32,
        origin: [0, 0],
        x:      this.getSpriteX(),
        y:      this.getSpriteY(),
        color: [1.0, 1.0, 1.0, 1.0],
    });
    this.points = points;
    this.speed = speed;
    this.sprite = Draw2DSprite.create({
        width:  this.width,
        height: this.height,
        origin: [0, 0],
        x:      this.getSpriteX(),
        y:      this.getSpriteY(),
        color: [1.0, 1.0, 1.0, 1.0],
    });
    this.body = phys2D.createRigidBody({
      type: 'kinematic',
      position: this.getPosition(),
      shapes: [phys2D.createPolygonShape({
        vertices: phys2D.createBoxVertices(this.width, this.height)
      })]
    });
    console.log(this.body.getPosition()[0] + ", " + this.body.getPosition()[1])
    this.loadTexture(graphicsDevice);
  }

  private getSpriteX() {
    return 2 * this.x + 1 * this.y;
  }
  
  private getSpriteY() {
    return -1 * this.x + 2 * this.y;
  }

  public getRigidBody() {
    return this.body;
  }

  public getPosition(){
    return [this.x, this.y];
  }

  loadTexture(graphicsDevice) {
    graphicsDevice.createTexture({
      src: "assets/textures/cross.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          this.sprite.setTexture(texture);
          this.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }.bind(this)
    });
  }

  draw(draw2D) {
    this.sprite.x = this.getSpriteX();
    this.sprite.y = this.getSpriteY();
    // additive makes dark colors transparent...
    draw2D.drawSprite(this.sprite);
  }

  updatePosition(time) {
    this.y -= this.speed;
    this.body.setPosition(this.getPosition());
    //console.log("Position of rigid body droplet " + this.body.getPosition()[0] + ", " + this.body.getPosition()[1])
  }
}
