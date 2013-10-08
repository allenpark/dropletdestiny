var droplet_md;

class Player {
  speed: number = 2.0;
  width:  number = 32;
  height: number = 32;
  sprite: Draw2DSprite;
  pos_x:  number = 50;
  pos_y:  number = 100;
  max_x:  number = 100;
  max_y:  number = 500;
  stageWidth: number;
  stageHeight: number;

  constructor(graphicsDevice, mathDevice, canvasX, canvasY) {
    droplet_md = mathDevice;
    this.sprite = Draw2DSprite.create({
        width:  this.width,
        height: this.height,
        origin: [0, 0],
        x:      this.getSpriteX(),
        y:      this.getSpriteY(),
        color: [1.0, 1.0, 1.0, 1.0],
    });
    this.stageWidth = canvasX;
    this.stageHeight = canvasY;
    this.loadTexture(graphicsDevice, this);
  }

  private getSpriteX() {
    return -1 * this.pos_x + 2 * this.pos_y;
  }
  
  private getSpriteY() {
    return 2 * this.pos_x + 1 * this.pos_y;
  }

  loadTexture(graphicsDevice, droplet) {
    graphicsDevice.createTexture({
      src: "assets/textures/protagonist.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          droplet.sprite.setTexture(texture);
          droplet.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }


  draw(draw2D) {
    this.sprite.x = this.getSpriteX();
    this.sprite.y = this.getSpriteY();
    // additive makes dark colors transparent...
    draw2D.begin('additive');
    draw2D.drawSprite(this.sprite);
    draw2D.end();
  }

  update(keys) {
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
          this.pos_y += this.speed;
          if (!this.inRangeY(this.pos_y) || !this.inCanvas()) {
            this.pos_y -= this.speed;
          }
          break;
        case 203: // Down
        case 18: // S
          this.pos_y -= this.speed;
          if (!this.inRangeY(this.pos_y) || !this.inCanvas()) {
            this.pos_y += this.speed;
          }
          break;
      }
    }
  }
  
  inRangeX(x) {
    return 0 <= x && x < this.max_x;
  }
  
  inRangeY(y) {
    return 0 <= y && y < this.max_y;
  }
  
  inCanvas() {
    var x = this.getSpriteX();
    var y = this.getSpriteY();
    return 0 <= x && x <= this.stageWidth - this.width && 0 <= y && y <= this.stageHeight - this.height;
  }
}
