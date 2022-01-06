import Asteroid from "./asteroid.js";
import Actor from "../engineSrc/actor.js";
import { randomNumberBetween } from "../engineSrc/toolBox.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";

class AsteroidGenerator extends Actor {
  timeTracker;
  nextSpawn;
  constructor() {
    super();
    this.timeTracker = 0;
    this.nextSpawn = randomNumberBetween(250, 750) / 1000;
  }
  update(delta) {
    this.timeTracker += delta;
    if (this.timeTracker >= this.nextSpawn) {
      const asteroid = new Asteroid(
        randomNumberBetween(0, GLOBALS.virtualScreenSize.width - 101),
        -100
      );
      GLOBALS.gamedata.asteroids.push(asteroid);
      GLOBALS.engine.addActor(asteroid);
      this.timeTracker = 0; //at zero to prevent multiple spawns on window focus
      this.nextSpawn = randomNumberBetween(250, 750) / 1000;
    }
  }
}

export default AsteroidGenerator;
