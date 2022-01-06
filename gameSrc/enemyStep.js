import LevelStep from "./levelStep.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";

class EnemyStep extends LevelStep {
  init;
  constructor(init = () => {}, func = (delta) => {}) {
    super((delta) => {
      if (!this.init) {
        init();
        this.init = true;
      }
      func(delta);
      if (GLOBALS.gamedata.onScreenEnemies.length === 0) {
        this.next = true;
        GLOBALS.engine.removeActor(this);
      }
    });
    this.init = false;
  }
}

export default EnemyStep;