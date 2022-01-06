import StaticBody from "../engineSrc/staticBody.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import Vector2 from "../shellriderMath/vector2.js";
import ParticleExplosion from "./particleExplosion.js";

class Enemy extends StaticBody {
  hitpoints;
  constructor(x, y, width = 10, height = 10) {
    super(x, y, width, height);
    this.hitpoints = 1;
  }

  update(delta) {
    GLOBALS.gamedata.playerShots.forEach((playerShot) => {
      if (GLOBALS.engine.physics.collide(this, playerShot)) {
        this.hitpoints -= 1;
        let shakeVector = new Vector2(1, 1);
        shakeVector = shakeVector.rotate(Math.random() * Math.PI * 2);
        GLOBALS.engine.screenShaker.putAtPositon(shakeVector.x, shakeVector.y);
        GLOBALS.engine.audio.play("hit");
        GLOBALS.gamedata.playerShots.splice(
          GLOBALS.gamedata.playerShots.indexOf(playerShot),
          1
        );
        GLOBALS.engine.removeActor(playerShot);
      }
    });
    if (this.hitpoints <= 0) {
      let shakeVector = new Vector2(10, 10);
      shakeVector = shakeVector.rotate(Math.random() * Math.PI * 2);
      GLOBALS.engine.screenShaker.putAtPositon(shakeVector.x, shakeVector.y);
      GLOBALS.engine.audio.play("explosion");
      GLOBALS.gamedata.onScreenEnemies.splice(
        GLOBALS.gamedata.onScreenEnemies.indexOf(this),
        1
      );
      const explosion = new ParticleExplosion(
        this.position.x + this.dimensions.width / 2,
        this.position.y + this.dimensions.height / 2,
        GLOBALS.engine
      );
      GLOBALS.engine.addActor(explosion);
      GLOBALS.engine.removeActor(this);
    }
  }
}

export default Enemy;
