import Actor from "./actor.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";

class TextActor extends Actor {
  position;
  text;
  size;
  fill;
  stroke;
  font;
  strokeWidth;

  constructor(text, x, y, size = 24, fill = "black", font = "sans-serif", stroke = undefined, stokeWidth = 1) {
    super();
    this.position = { x: x, y: y };
    this.text = text;
    this.size = size;
    this.fill = fill;
    this.stroke = stroke;
    this.font = font;
    this.strokeWidth = stokeWidth;
  }

  render() {
    GLOBALS.ctx.save();
    GLOBALS.ctx.font = `${this.size}px ${this.font}`;
    GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
    GLOBALS.ctx.translate(
      (this.position.x - GLOBALS.ctx.measureText(this.text).width/2),
      this.position.y
    );

    GLOBALS.ctx.fillStyle = this.fill;
    GLOBALS.ctx.strokeStyle = this.stroke
    GLOBALS.ctx.lineWidth = this.strokeWidth;
    GLOBALS.ctx.fillText(this.text,0,0);
    if(this.stroke) {
        GLOBALS.ctx.strokeText(this.text,0,0);
    }

    GLOBALS.ctx.restore();
  }
}

export default TextActor;
