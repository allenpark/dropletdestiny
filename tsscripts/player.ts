var player_md;

class Player {
  body: any;
  speed: number = 2.0;
  width:  number = 32;
  height: number = 32;
  sprite: Draw2DSprite;
  pos_x:  number = 50;
  pos_y:  number = 100;
  min_x:  number = 0;
  min_y:  number = 0;
  max_x:  number = 100;
  max_y:  number = 500;
  last_x_direction_moved: number = 1;
  x_oscillate: number = 0;
  default_oscillate_step: number = 1.0;
  oscillate_step: number = 1.0; // should be same as default_oscillate_step
  max_oscillate: number = 5.0;
  stageWidth: number;
  stageHeight: number;
  size:   number = 1;
  

  constructor(graphicsDevice, phys2D, mathDevice, canvasX, canvasY) {
    player_md = mathDevice;
    this.sprite = Draw2DSprite.create({
        width:  this.width,
        height: this.height,
        origin: [0, 0],
        x:      this.getSpriteX(),
        y:      this.getSpriteY(),
        color: [1.0, 1.0, 1.0, 1.0],
    });
    this.body = phys2D.createRigidBody({
      type: 'dynamic', 
      position: this.getPosition(),
      shapes: [phys2D.createPolygonShape({
        vertices: phys2D.createBoxVertices(this.width/2, this.height/2)
      })]
    });
    this.stageWidth = canvasX;
    this.stageHeight = canvasY;
    this.loadTexture(graphicsDevice);
  }

  private getSpriteX() {
    return 2 * this.pos_x + 1 * this.pos_y;
  }
  
  private getSpriteY() {
    return -1 * this.pos_x + 2 * this.pos_y;
  }

  public getRigidBody() {
    return this.body;
  }

  public getPosition(){
    return [this.pos_x, this.pos_y];
  }

  loadTexture(graphicsDevice) {
    graphicsDevice.createTexture({
      src: "assets/textures/particle.png",
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
    draw2D.drawSprite(this.sprite);
  }

  update(keys) {
    var formerX = this.pos_x;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // TODO: support sliding down a side so movements partially into a wall don't get completely undone
      switch (key) {
        case 200: // Left
        case 0: // A
          this.pos_x -= this.speed;
          if (!this.inRangeX(this.pos_x) || !this.inCanvas()) {
            this.pos_x += this.speed;
          }
          break;
        case 201: // Right
        case 3: // D
          this.pos_x += this.speed;
          if (!this.inRangeX(this.pos_x) || !this.inCanvas()) {
            this.pos_x -= this.speed;
          }
          break;
        case 202: // Up
        case 22: // W
          this.pos_y -= this.speed;
          if (!this.inRangeY(this.pos_y) || !this.inCanvas()) {
            this.pos_y += this.speed;
          }
          break;
        case 203: // Down
        case 18: // S
          this.pos_y += this.speed;
          if (!this.inRangeY(this.pos_y) || !this.inCanvas()) {
            this.pos_y -= this.speed;
          }
          break;
      }
    }
    /*if (this.pos_x == formerX) {
      // put in waviness
      if (this.last_x_direction_moved != 0) {
        this.oscillate_step = this.oscillate_step * this.last_x_direction_moved;
        this.last_x_direction_moved = 0;
      }
      this.pos_x += this.oscillate_step;
      this.x_oscillate += this.oscillate_step;
      if (!this.inRangeX(this.pos_x) || this.oscillate_step * this.x_oscillate > Math.abs(this.oscillate_step * this.max_oscillate)) {
        this.pos_x -= this.oscillate_step * 2;
        this.x_oscillate -= this.oscillate_step * 2;
        this.oscillate_step *= -1;
      }
    } else {
      this.x_oscillate = 0;
      this.oscillate_step = this.default_oscillate_step;
      this.last_x_direction_moved = (this.pos_x - formerX) / Math.abs(this.pos_x - formerX);
    }*/
  }
  
  inRangeX(x) {
    return this.min_x <= x && x < this.max_x;
  }
  
  inRangeY(y) {
    return this.min_y <= y && y < this.max_y;
  }
  
  inCanvas() {
    var x = this.getSpriteX();
    var y = this.getSpriteY();
    return 0 <= x && x <= this.stageWidth - this.width && 0 <= y && y <= this.stageHeight - this.height;
  }
}
