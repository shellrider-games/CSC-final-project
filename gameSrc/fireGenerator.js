import Particle from "../engineSrc/particle.js";
import ParticleManager from "../engineSrc/particleManager.js";
import { randomNumberBetween } from "../engineSrc/toolBox.js";
import Vector2 from "../shellriderMath/vector2.js";


//A flame that points in a direction defined by a vector, extends a ParticleManager for Flames
class FireGenerator extends ParticleManager {
  nextParticle;
  position;
  direction;

  constructor(x, y, engine, direction = { x: 0, y: -1 }) {
    super(engine);
    this.position = {
      x: x,
      y: y,
    };
    this.nextParticle = 0.25;
    this.direction = new Vector2(direction.x, direction.y);
  }

  update(delta) {
    super.update(delta);
    this.nextParticle = Math.max(this.nextParticle - delta, 0);
    if (this.nextParticle <= 0) {
      this.addParticle(
        new Particle(
          this.position.x,
          this.position.y,
          4,
          [255, randomNumberBetween(0, 255), 0],
          0.25,
          this.direction.rotate(randomNumberBetween(-30, 30) * 0.017453),
          200
        )
      );
      this.nextParticle = 0.05;
    }
  }
}

export default FireGenerator;
