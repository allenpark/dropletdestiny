var droplet_md;

class Player {
  width:  number = 32;
  height: number = 32;
  sprite: Draw2DSprite;
  pos_x:  number = 100;
  pos_y:  number = 100;

  constructor(graphicsDevice, mathDevice) {
    droplet_md = mathDevice;
    this.sprite = Draw2DSprite.create({
        width:  this.width,
        height: this.height,
        origin: [this.width / 2, this.height / 2],
        x:      this.pos_x,
        y:      this.pos_y,
        color: [1.0, 1.0, 1.0, 1.0],
    });
    this.loadTexture(graphicsDevice, this);
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
    // additive makes dark colors transparent...
    draw2D.begin('additive');
    draw2D.drawSprite(this.sprite);
    draw2D.end();
  }

  update(key, keyPressed) {
    if (keyPressed){
      switch (key) {
        case 200: // Left
        case 0: // A
          this.sprite.x += -2;
          this.sprite.y += 1;
        break;
        case 201: // Right
        case 3: // D
          this.sprite.x += 2;
          this.sprite.y += -1;
        break;
        case 202: // Up
        case 22: // W
          this.sprite.x += -1;
          this.sprite.y += -2;
        break;
        case 203: // Down
        case 18: // S
          this.sprite.x += 1;
          this.sprite.y += 2;
        break;
        default:
        return 1;
      return 0;
      }
    }
    else{
      return 0;
    }
  }
}
