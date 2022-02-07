import StaticBody from "../engineSrc/staticBody.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";

/**
 * Class that represents asteroids that player has to evade
 */
class Asteroid extends StaticBody {
  constructor(x, y, width = 101, height = 84) {
    super(x, y, width, height);
    this.sprite = GLOBALS.sprites.asteroidSprite;
  }

  update(delta) {
    this.position.y += 300 * delta;
    if (this.position.y >= GLOBALS.virtualScreenSize.height + 200) {
      GLOBALS.gamedata.asteroids.splice(
        GLOBALS.gamedata.asteroids.indexOf(this),
        1
      );
      GLOBALS.engine.removeActor(this);
    }
  }

  getBoundingBox() {
    return {
      x: this.position.x + 8,
      y: this.position.y,
      width: this.dimensions.width - 16,
      height: this.dimensions.height - 16,
    };
  }
}

export default Asteroid;
