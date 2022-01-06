import Enemy from "./enemy.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import FireGenerator from "./fireGenerator.js";
import EnemyShot from "./enemyShot.js";

class EnemyGrunt extends Enemy {
  speed;
  target;
  shotDelay;
  hitpoints;
  fireEngine;
  constructor(x, y, width = 93, height = 84, hitpoints = 3) {
    super(x, y, width, height);
    this.sprite = GLOBALS.sprites.enemyGruntSprite;
    this.speed = 300;
    this.target = { x: x, y: y };
    this.shotDelay = 1;
    this.hitpoints = hitpoints;
    this.fireEngine = new FireGenerator(
      this.position.x + this.dimensions.width / 2,
      this.position.y + 5,
      GLOBALS.engine
    );
  }
  update(delta) {
    this.shotDelay = Math.max(0, this.shotDelay - delta);
    if (this.shotDelay <= 0) {
      const newShot = new EnemyShot(
        this.position.x + this.dimensions.width / 2,
        this.position.y + this.dimensions.height
      );
      this.shotDelay = 2;
      GLOBALS.engine.audio.play("laser");
      GLOBALS.gamedata.enemyShots.push(newShot);
      GLOBALS.engine.addActor(newShot);
    }
    if (
      !(this.position.x === this.target.x && this.position.y === this.target.y)
    ) {
      const directionVector = {
        x: this.target.x - this.position.x,
        y: this.target.y - this.position.y,
      };
      const directionVectorValue = Math.sqrt(
        directionVector.x ** 2 + directionVector.y ** 2
      );
      directionVector.x = directionVector.x / directionVectorValue;
      directionVector.y = directionVector.y / directionVectorValue;

      if (directionVectorValue >= this.speed * delta) {
        this.position.x =
          this.position.x + directionVector.x * this.speed * delta;
        this.position.y =
          this.position.y + directionVector.y * this.speed * delta;
      } else {
        this.position.x = this.target.x;
        this.position.y = this.target.y;
      }
    }
    this.fireEngine.position.x = this.position.x + this.dimensions.width / 2;
    this.fireEngine.position.y = this.position.y + 5;
    this.fireEngine.update(delta);
    super.update(delta);
  }
}

export default EnemyGrunt;
