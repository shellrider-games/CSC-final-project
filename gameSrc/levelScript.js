import Actor from "../engineSrc/actor.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";


//A collection of Steps that are done in sucession when the next step condition is met.
class LevelScript extends Actor {
  steps;
  currentIndex;
  constructor(steps = [], currentIndex = -1) {
    super();
    this.steps = steps;
    this.currentIndex = currentIndex;
  }
  update(delta) {
    if (this.currentIndex < this.steps.length - 1) {
      if (this.currentIndex < 0 && this.steps.length >= 1) {
        this.currentIndex = 0;
        GLOBALS.engine.addActor(this.steps[0]);
      }
      if (this.steps[this.currentIndex].next) {
        GLOBALS.engine.addActor(this.steps[++this.currentIndex]);
      }
    }
  }
}

export default LevelScript;
