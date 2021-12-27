import Actor from "../actor.js";
import { GLOBALS } from "../shellriderEngineGlobals.js";
import NineSliceImage from "../NineSliceImage.js";

class ShellriderButton extends Actor {
  position;
  dimensions;
  text;
  defaultImage;
  hoverImage;
  pressedImage;
  state;

  constructor(x,y,width,height,text){
    super();
    this.position = {x: x, y:y};
    this.dimensions = {width: width, height:height};
    this.text = text;
    this.defaultImage = new NineSliceImage(width,height);
  }

  render() {
    GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
    GLOBALS.ctx.translate(this.position.x, this.position.y);
    this.defaultImage.render();
  }
}

export default ShellriderButton;
