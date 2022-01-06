import { GLOBALS } from "../engineSrc/shellriderEngineGlobals";
import Vector2 from "../shellriderMath/vector2";
import EnemyShot from "./enemyShot";

class EnemySpreadShot extends EnemyShot {
  rotation;
  constructor(x, y, width = 37, height = 36, rotation = 0) {
    super(x, y, width, height);
    this.rotation = rotation;
    this.sprite = GLOBALS.sprites.enemySpreadLaserSprite;
  }

  update(delta) {
    const moveVector = new Vector2(0, 600);
    moveVector = moveVector.rotate(this.rotation);
    this.position.x += moveVector.x;
    this.position.y += moveVector.y;
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
