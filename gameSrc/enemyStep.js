import LevelStep from "./levelStep.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";


//A level step that checks if all enemies are dead before setting all the data to switch to the next step
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