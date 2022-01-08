import Actor from "./actor.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";

class TextActor extends Actor {
  position;
  text;
  size;
  fill;
  stroke;
  font;

  constructor(text, x, y, size = 24, fill = "black", font = "sans-serif", stroke = undefined) {
    super();
    this.position = { x: x, y: y };
    this.text = text;
    this.size = size;
    this.fill = fill;
    this.stroke = stroke;
    this.font = font;
  }

  render() {
    GLOBALS.ctx.save();
    let saveFillStyle = GLOBALS.ctx.fillStyle;
    let saveStrokeStyle = GLOBALS.ctx.strokeStyle;
    GLOBALS.ctx.font = `${this.size}px ${this.font}`;
    GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
    GLOBALS.ctx.translate(
      (this.position.x - GLOBALS.ctx.measureText(this.text).width/2),
      this.position.y
    );

    GLOBALS.ctx.fillStyle = this.fill;
    GLOBALS.ctx.strokeStyle = this.stroke
    GLOBALS.ctx.lineWidth = 4;
    GLOBALS.ctx.fillText(this.text,0,0);
    if(this.stroke) {
        GLOBALS.ctx.strokeText(this.text,0,0);
    }

    GLOBALS.ctx.restore();
  }
}

export default TextActor;
