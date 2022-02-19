import Actor from "./actor.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";
import Sprite from "./sprite.js";


/*
* An Actor that has a position, dimensions and can have a sprite containing it's image data
* provides a default bounding box for physics
*/
class StaticBody extends Actor {
  position;
  dimensions;
  sprite;

  constructor(x = 0, y = 0, width = 10, height = 10) {
    super();
    this.position = { x: x, y: y };
    this.dimensions = { width: width, height: height };
  }

  render() {
    GLOBALS.ctx.save();
    let saveFillStyle = GLOBALS.ctx.fillStyle;
    let saveStrokeStyle = GLOBALS.ctx.strokeStyle;
    GLOBALS.ctx.translate(
      this.position.x * GLOBALS.scaleFactor.x,
      this.position.y * GLOBALS.scaleFactor.y
    );
    if (this.sprite instanceof Sprite) {
      GLOBALS.ctx.drawImage(
        this.sprite.image,
        0,
        0,
        this.sprite.width * GLOBALS.scaleFactor.x,
        this.sprite.height * GLOBALS.scaleFactor.y
      );
    } else {
      GLOBALS.ctx.fillStyle = "magenta";
      GLOBALS.ctx.fillRect(
        0,
        0,
        this.dimensions.width * GLOBALS.scaleFactor.x,
        this.dimensions.height * GLOBALS.scaleFactor.y
      );
    }
    if (GLOBALS.debug) {
      GLOBALS.ctx.strokeStyle = "limegreen";
      GLOBALS.ctx.restore();
      const bb = this.getBoundingBox();
      GLOBALS.ctx.strokeRect(
        bb.x * GLOBALS.scaleFactor.x,
        bb.y * GLOBALS.scaleFactor.y,
        bb.width * GLOBALS.scaleFactor.x,
        bb.height * GLOBALS.scaleFactor.y
      );
    }
    GLOBALS.ctx.fillStyle = saveFillStyle;
    GLOBALS.ctx.strokeStyle = saveStrokeStyle;
    GLOBALS.ctx.restore();
  }

  getBoundingBox() {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.dimensions.width,
      height: this.dimensions.height,
    };
  }
}

export default StaticBody;
