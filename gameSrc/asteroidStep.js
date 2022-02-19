import LevelStep from "./levelStep.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import AsteroidGenerator from "./asteroidGenerator.js";


//Step of the level that takes a 8 seconds and creates asteroids for 5 seconds
class AsteroidStep extends LevelStep {
  constructor() {
    super((delta) => {
      this.timePassed += delta;
      if (!this.init) {
        GLOBALS.engine.addActor(this.asteroidGenerator);
        this.init = true;
        this.asteroidGeneratorRemoved = false;
      }
      if (this.timePassed >= 5 && !this.asteroidGeneratorRemoved) {
        GLOBALS.engine.removeActor(this.asteroidGenerator);
        this.asteroidGeneratorRemoved = true;
      }
      if (this.timePassed >= 8) {
        this.next = true;
        GLOBALS.engine.removeActor(this);
      }
    });
    this.init = false;
    this.timePassed = 0;
    this.asteroidGenerator = new AsteroidGenerator();
  }
}

export default AsteroidStep;