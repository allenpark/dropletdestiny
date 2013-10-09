var obstacle_md;

class Obstacle {
  sprite: Draw2DSprite;
  x: number;
  y: number;
  points: number;
  
  constructor(graphicsDevice, mathDevice, sprite, x, y, points) {
    obstacle_md = mathDevice;
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.points = points;
    this.loadTexture(graphicsDevice);
  }

  private getSpriteX() {
    return 2 * this.x + 1 * this.y;
  }
  
  private getSpriteY() {
    return -1 * this.x + 2 * this.y;
  }

  loadTexture(graphicsDevice) {
    graphicsDevice.createTexture({
      src: "assets/textures/brick.png",
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

  update() {
    // TODO: fill in
  }
}
