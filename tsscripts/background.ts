

class Background extends imageSprite{
  
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/bg.jpg",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }