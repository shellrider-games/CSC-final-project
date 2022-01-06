import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import Scene from "../engineSrc/scene.js";
import { canvasAutoAdjust } from "../index.js";

class EndState extends Scene {
  text;
  currentlyTouched;

  constructor(text, actors = []) {
    super(actors);
    this.text = text;
  }

  preUpdates() {
    canvasAutoAdjust();
  }

  postRenders() {
    GLOBALS.ctx.save();
    GLOBALS.ctx.fillStyle = "#efefef";
    GLOBALS.ctx.font = `42px KenneyFuture`;
    GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
    GLOBALS.ctx.fillText(
      this.text,
      GLOBALS.virtualScreenSize.width / 2 -
        GLOBALS.ctx.measureText(this.text).width / 2,
      GLOBALS.virtualScreenSize.height / 2 - 100
    );
    GLOBALS.ctx.restore();
  }
  onSceneEntry() {}
  postUpdates() {}
}

export default EndState;
