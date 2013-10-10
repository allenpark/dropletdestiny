

class Background {
  width:  number = 32;
  height: number = 32;
  sprite: Draw2DSprite;
  pos_x:  number = 50;
  pos_y:  number = 100;
  stageWidth: number;
  stageHeight: number;
  
  constructor(graphicsDevice, mathDevice, canvasX, canvasY) {
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
    return 2 * this.pos_x + 1 * this.pos_y;
  }
  
  private getSpriteY() {
    return -1 * this.pos_x + 2 * this.pos_y;
  }

  loadTexture(graphicsDevice, bg) {
    graphicsDevice.createTexture({
      src: "assets/textures/stones2.jpg",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }


  draw(draw2D) {
    this.sprite.x = this.getSpriteX();
    this.sprite.y = this.getSpriteY();
    // additive makes dark colors transparent...
    draw2D.drawSprite(this.sprite);
  }
  
  inCanvas() {
    var x = this.getSpriteX();
    var y = this.getSpriteY();
    return 0 <= x && x <= this.stageWidth - this.width && 0 <= y && y <= this.stageHeight - this.height;
  }

