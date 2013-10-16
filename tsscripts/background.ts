
class Sky extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/sky.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class MountainSide extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/mountainside.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Tree extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/tree1.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Shrub extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/shrub1.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Cloud1 extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/cloud1.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Cloud2 extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/cloud2.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Hill1 extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/hill1.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Hill2 extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/hill2.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Mountain1 extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/mountain1.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Mountain2 extends imageSprite{

    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/mountain2.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}

class Mountain3 extends imageSprite{
    loadTexture(graphicsDevice, bg) {
    this.texture = graphicsDevice.createTexture({
      src: "assets/textures/mountain3.png",
      mipmaps: true,
      onload: function (texture) {
        if (texture) {
          bg.sprite.setTexture(texture);
          bg.sprite.setTextureRectangle([0, 0, texture.width, texture.height]);
        }
      }
    });
  }
}