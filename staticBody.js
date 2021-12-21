import Actor from "./actor.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";
import Sprite from "./sprite.js";

class StaticBody extends Actor {
  position;
  dimensions;
  sprite;

  constructor(x = 0, y = 0, width = 10, height = 10) {
    super();
    this.position = { x: x , y: y};
    this.dimensions = {width:width, height: height};
  }

  render() {
      GLOBALS.ctx.translate(this.position.x*GLOBALS.scaleFactor.x, this.position.y*GLOBALS.scaleFactor.y);
      if(this.sprite instanceof Sprite) {
        GLOBALS.ctx.drawImage(this.sprite.image, 0, 0, this.sprite.width*GLOBALS.scaleFactor.x, this.sprite.height*GLOBALS.scaleFactor.y);
      } else {
        GLOBALS.ctx.fillStyle = "magenta";
        GLOBALS.ctx.fillRect(0,0,this.dimensions.width*GLOBALS.scaleFactor.x,this.dimensions.height*GLOBALS.scaleFactor.y);
      }
      GLOBALS.ctx.resetTransform();
  }
}

export default StaticBody;
