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
  constructor(x,y,width,height,text = "DEFAULT TEXT"){
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
    GLOBALS.ctx.font = "24px Arial";
    GLOBALS.ctx.strokeStyle = "black";
    GLOBALS.ctx.fillStyle = "black";
    GLOBALS.ctx.lineWidth = 2;
    const textMeasure = GLOBALS.ctx.measureText(this.text);
    GLOBALS.ctx.fillText(this.text, this.dimensions.width/2-textMeasure.width/2,this.dimensions.height/2+(textMeasure.actualBoundingBoxAscent+textMeasure.actualBoundingBoxDescent)/2);
    GLOBALS.ctx.resetTransform();
  }
}

export default ShellriderButton;
