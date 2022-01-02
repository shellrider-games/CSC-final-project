import Particle from "./particle.js";
import ParticleManager from "./particleManager.js";
import { randomNumberBetween } from "./toolBox.js";

class ParticleExplosion extends ParticleManager {
  timeToLive;
  position;
  radius;
  particleMinSize;
  particleMaxSize;

  constructor(
    x,
    y,
    engine,
    timeToLive = 0.2,
    radius = 50,
    particleMinSize = 4,
    particleMaxSize = 20
  ) {
    super(engine);
    this.position = { x: x, y: y };
    this.timeToLive = timeToLive;
    this.radius = radius;
    this.particleMinSize = particleMinSize;
    this.particleMaxSize = particleMaxSize;
  }

  update(delta) {
    super.update(delta);
    this.timeToLive -= delta;

    for (let i = 0; i <= 2; i++) {
      if (this.timeToLive > 0) {
        this.addParticle(
          new Particle(
            this.position.x + randomNumberBetween(-this.radius, this.radius),
            this.position.y + randomNumberBetween(-this.radius, this.radius),
            randomNumberBetween(this.particleMinSize, this.particleMaxSize),
            [255, randomNumberBetween(100, 240), 0],
            0.1
          )
        );
      }
    }

    if (
      this.timeToLive <= 0 &&
      !(Array.isArray(this.particles) && this.particles.length)
    ) {
      this.engine.removeActor(this);
    }
  }
}

export default ParticleExplosion;
