import StaticBody from "../engineSrc/staticBody.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import FireGenerator from "./fireGenerator.js";
import PlayerShot from "./playerShot.js";

class PlayerShip extends StaticBody {
  speed;
  shotDelay;
  shield;
  nextShield;
  hitpoints;
  fireEngine1;
  fireEngine2;

  constructor(
    x = 0,
    y = GLOBALS.virtualScreenSize.height - 220,
    width = 99,
    height = 75
  ) {
    super(x, y, width, height);
    this.sprite = GLOBALS.sprites.playerShipSprite;
    this.speed = 500;
    this.shotDelay = 0;
    this.shield = true;
    this.nextShield = 0;
    this.hitpoints = 1;
    this.fireEngine1 = new FireGenerator(
      this.position.x + this.dimensions.width / 2 - 25,
      this.position.y + this.dimensions.height - 5,
      GLOBALS.engine,
      { x: 0, y: 1 }
    );
    this.fireEngine2 = new FireGenerator(
      this.position.x + this.dimensions.width / 2 + 25,
      this.position.y + this.dimensions.height - 5,
      GLOBALS.engine,
      { x: 0, y: 1 }
    );
  }

  getBoundingBox() {
    let bb = {
      x: this.position.x,
      y: this.position.y + 25,
      width: this.dimensions.width,
      height: this.dimensions.height - 40,
    };
    return bb;
  }

  update(delta) {
    let goalX;
    this.shotDelay = Math.max(this.shotDelay - delta, 0);
    this.nextShield = Math.max(this.nextShield - delta, 0);

    if (GLOBALS.touch.active) {
      goalX = Math.min(
        Math.max(GLOBALS.touch.x - this.dimensions.width / 2, 0),
        GLOBALS.virtualScreenSize.width - this.dimensions.width
      );
      GLOBALS.mouse.x = goalX;
    } else {
      goalX = Math.min(
        Math.max(GLOBALS.mouse.x - this.dimensions.width / 2, 0),
        GLOBALS.virtualScreenSize.width - this.dimensions.width
      );
    }
    Math.min(
      Math.max(GLOBALS.mouse.x - this.dimensions.width / 2, 0),
      GLOBALS.virtualScreenSize.width - this.dimensions.width
    );

    goalX > this.position.x
      ? (this.position.x = Math.min(
          this.position.x + this.speed * delta,
          goalX
        ))
      : (this.position.x = Math.max(
          this.position.x - this.speed * delta,
          goalX
        ));

    if ((GLOBALS.touch.active || GLOBALS.mouse.down) && this.shotDelay === 0) {
      const newShot = new PlayerShot(
        this.position.x +
          this.dimensions.width / 2 -
          GLOBALS.sprites.laserShotSprite.width / 2,
        this.position.y - this.dimensions.height / 2
      );
      this.shotDelay = 0.25;
      GLOBALS.engine.audio.play("laser");
      GLOBALS.gamedata.playerShots.push(newShot);
      GLOBALS.engine.addActor(newShot);
    }
    if (!this.shield && this.nextShield <= 0) {
      this.shield = true;
    }
    this.fireEngine1.position.x =
      this.position.x + this.dimensions.width / 2 - 25;
    this.fireEngine1.position.y = this.position.y + this.dimensions.height - 5;

    this.fireEngine2.position.x =
      this.position.x + this.dimensions.width / 2 + 25;
    this.fireEngine2.position.y = this.position.y + this.dimensions.height - 5;

    this.fireEngine1.update(delta);
    this.fireEngine2.update(delta);
  }
  render() {
    super.render();
    GLOBALS.ctx.save();
    if (this.shield) {
      GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
      GLOBALS.ctx.translate(
        this.position.x +
          this.dimensions.width / 2 -
          GLOBALS.sprites.shieldSprite.width / 2,
        this.position.y - 20
      );
      GLOBALS.ctx.drawImage(GLOBALS.sprites.shieldSprite.image, 0, 0);
      GLOBALS.ctx.restore();
    }
  }

  damage() {
    if (this.shield) {
      this.destroyShield();
    } else {
      this.hitpoints -= 1;
    }
  }

  destroyShield() {
    this.shield = false;
    this.nextShield = 10;
  }
}

export default PlayerShip;
