import LevelStep from "./levelStep.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";

//Step that just waits a predefined amount of time before moving to the next one
class WaitStep extends LevelStep {
  timePassed;
  constructor(time) {
    super((delta) => {
      this.timePassed += delta;
      if (this.timePassed >= time) {
        this.next = true;
        GLOBALS.engine.removeActor(this);
      }
    });
    this.timePassed = 0;
  }
}

export default WaitStep;