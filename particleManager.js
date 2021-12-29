import Actor from "./actor.js";
import Particle from "./particle.js";

class ParticleManager extends Actor {
  engine;
  particles;
  constructor(engine) {
    super();
    this.engine = engine;
    this.particles = [];
  }

  addParticle(particle) {
    this.particles.push(particle);
    this.engine.addActor(particle);
  }

  update(delta) {
    this.particles.forEach((particle) => {
      if (particle.ellapsedTime > particle.timeToLive) {
        this.engine.removeActor(particle);
        this.particles.splice(this.particles.indexOf(particle), 1);
      }
    });
  }
}

export default ParticleManager;
