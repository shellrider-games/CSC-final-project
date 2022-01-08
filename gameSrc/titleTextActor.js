import TextActor from "../engineSrc/textActor.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";

class TitleTextActor extends TextActor {
  scale;
  targetSize;
  animationSpeed;
  moveSpeed;
  direction;
  originalPosition;
  swayDistance;

  constructor(text, x, y, size = 24) {
    const fontGradient = GLOBALS.ctx.createLinearGradient(0, 0, 150, 150);
    fontGradient.addColorStop(0, "rgb(228,87,11)");
    fontGradient.addColorStop(1, "rgb(255,196,0)");
    super(text, x, y, size, fontGradient, "KenneyFuture", "black", 2);
    this.targetSize = size;
    this.originalPosition = {...this.position};
    this.scale = 0;
    this.size = this.targetSize * this.scale;
    this.animationSpeed = 3;
    this.moveSpeed = 5;
    this.swayDistance = 4;
    this.direction = true;
  }

  render() {
    GLOBALS.ctx.save();
    super.render();
    GLOBALS.ctx.restore();
  }

  update(delta) {
    this.scale += (1 - this.scale) * delta * this.animationSpeed;
    this.size = this.targetSize * this.scale;


    if (this.direction) {
      this.position.y += delta * this.moveSpeed;
      if (this.originalPosition.y - this.position.y <= -this.swayDistance) {
        this.direction = !this.direction;
      }
    } else {
      this.position.y -= delta * this.moveSpeed;
      if (this.originalPosition.y - this.position.y >= this.swayDistance) {
        this.direction = !this.direction;
      }
    }
  }
}

export default TitleTextActor;
