//var droplet_md;

class Droplet {
  sprite: Draw2DSprite;
  x: number;
  y: number;
  points: number;
  speed: number;
  width:  number = 32;
  height: number = 32;
  
  constructor(graphicsDevice, mathDevice, /*sprite,*/ x, y, points, speed) {
    droplet_md = mathDevice;
    //this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.points = points;
    this.loadTexture(graphicsDevice, this);
    this.speed = speed;
    this.sprite = Draw2DSprite.create({
        width:  this.width,
        height: this.height,
        origin: [0, 0],
        x:      this.getSpriteX(),
        y:      this.getSpriteY(),
        color: [1.0, 1.0, 1.0, 1.0],
    });
  }

  loadTexture(graphicsDevice, droplet) {
    // TODO: make this do the right thing.
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

  private getSpriteX() {
    return 2 * this.x + 1 * this.y;
  }
  
  private getSpriteY() {
    return -1 * this.x + 2 * this.y;
  }

  draw(draw2D) {
    this.sprite.x = this.getSpriteX();
    this.sprite.y = this.getSpriteY();
    // additive makes dark colors transparent...
    draw2D.drawSprite(this.sprite);
  }

  updatePosition(time) {
    this.y -= this.speed;
  }
}
