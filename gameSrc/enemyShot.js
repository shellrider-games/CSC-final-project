import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import StaticBody from "../engineSrc/staticBody.js";

class EnemyShot extends StaticBody {
  //default width and height are smaller than the sprite to make it easier for the player to evade
  constructor(x, y, width = 9, height = 37) {
    super(x, y, width, height);
    this.sprite = GLOBALS.sprites.enemyLaserSprite;
  }
  update(delta) {
    this.position.y += 600 * delta;
    if (this.position.y >= GLOBALS.virtualScreenSize.height + 200) {
      GLOBALS.gamedata.enemyShots.splice(
        GLOBALS.gamedata.enemyShots.indexOf(this),
        1
      );
      GLOBALS.engine.removeActor(this);
    }
  }
}

export default EnemyShot;
