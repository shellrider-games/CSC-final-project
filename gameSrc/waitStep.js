import LevelStep from "./levelStep.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";

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