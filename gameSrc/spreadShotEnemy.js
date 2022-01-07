import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import Enemy from "./enemy.js";
import FireGenerator from "./fireGenerator.js";
import EnemySpreadShot from "./enemySpreadShot.js";

class SpreadShotEnemy extends Enemy {
  shotDelay;
  fireEngine;
  speed;
  constructor(x, y, width = 104, height = 84) {
    super(x, y, width, height);
    this.sprite = GLOBALS.sprites.spreadShotEnemySprite;
    this.hitpoints = 5;
    this.shotDelay = 0.5;
    this.fireEngine = new FireGenerator(
      this.position.x + this.dimensions.width / 2,
      this.position.y - 10,
      GLOBALS.engine,
      { x: 0, y: -1 }
    );
    this.speed = 400;
  }

  update(delta) {
    this.shotDelay = Math.max(0, this.shotDelay - delta);
    if (this.shotDelay <= 0) {
      this.shotDelay = 2;
      let shots = [];
      shots.push(
        new EnemySpreadShot(
          this.position.x + this.dimensions.width / 2 - 37/2,
          this.position.y + this.dimensions.height,
          0
        )
      );

      shots.push(
        new EnemySpreadShot(
          this.position.x + this.dimensions.width / 2 - 37/2,
          this.position.y + this.dimensions.height,
          1/3
        )
      );

      shots.push(
        new EnemySpreadShot(
          this.position.x + this.dimensions.width / 2 - 37/2,
          this.position.y + this.dimensions.height,
          -1/3
        )
      );


      shots.forEach((shot) => {
        GLOBALS.gamedata.enemyShots.push(shot);
        GLOBALS.engine.addActor(shot);
      });
      GLOBALS.engine.audio.play("laser");
    }

    this.fireEngine.position.x = this.position.x + this.dimensions.width / 2;
    this.fireEngine.position.y = this.position.y - 10;
    this.fireEngine.update(delta);
    super.update(delta);
  }
}

export default SpreadShotEnemy;
