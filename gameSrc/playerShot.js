import StaticBody from "../engineSrc/staticBody.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";

class PlayerShot extends StaticBody {
  constructor(x, y, width = 9, height = 37) {
    super(x, y, width, height);
    this.sprite = GLOBALS.sprites.laserShotSprite;
  }
  update(delta) {
    this.position.y -= 1000 * delta;
    if (this.position.y <= -200) {
      GLOBALS.gamedata.playerShots.splice(
        GLOBALS.gamedata.playerShots.indexOf(this),
        1
      );
      GLOBALS.engine.removeActor(this);
    }
  }
}

export default PlayerShot;
