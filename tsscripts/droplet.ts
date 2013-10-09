var droplet_md;

class Droplet {
  sprite: Draw2DSprite;
  x: number;
  y: number;
  points: number;
  
  constructor(graphicsDevice, mathDevice, sprite, x, y, points) {
    droplet_md = mathDevice;
    this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.points = points;
    this.loadTexture(graphicsDevice, this);
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


  draw(draw2D, frame) {
    // TODO: fill in
  }

  update(time) {
    // TODO: fill in
  }
}
