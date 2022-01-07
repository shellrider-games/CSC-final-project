import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import Vector2 from "../shellriderMath/vector2.js";
import EnemyShot from "./enemyShot.js";

class EnemySpreadShot extends EnemyShot {
  rotation;
  constructor(x, y, rotation = 0, width = 37, height = 36) {
    super(x, y, width, height);
    this.rotation = rotation;
    this.sprite = GLOBALS.sprites.enemySpreadLaserSprite;
  }

  update(delta) {
    let moveVector = new Vector2(0, 600);
    moveVector = moveVector.rotate(this.rotation);
    this.position.x += moveVector.x * delta;
    this.position.y += moveVector.y * delta;
    if (
      this.position.y >= GLOBALS.virtualScreenSize.height + 200 ||
      this.position.y <= -200 ||
      this.position.x >= GLOBALS.virtualScreenSize.width + 200 ||
      this.position.x <= -200
    ) {
      GLOBALS.gamedata.enemyShots.splice(
        GLOBALS.gamedata.enemyShots.indexOf(this),
        1
      );
      GLOBALS.engine.removeActor(this);
    }
  }
}

export default EnemySpreadShot;
