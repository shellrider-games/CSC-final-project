import StaticBody from "../engineSrc/staticBody.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";


//This class manages the position and dimensions of the player shots
class PlayerShot extends StaticBody {
  constructor(x, y, width = 9, height = 37) {
    super(x, y, width, height);
    this.sprite = GLOBALS.sprites.laserShotSprite; //green laser
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
