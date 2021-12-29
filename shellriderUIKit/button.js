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
  pressedTranlation;
  state;
  prevState;
  constructor(x, y, width, height, text = "DEFAULT TEXT") {
    super();
    this.position = { x: x, y: y };
    this.dimensions = { width: width, height: height };
    this.text = text;
    this.defaultImage = new NineSliceImage(width, height);
    this.pressedImage = new NineSliceImage(width, height - 4, {
      sprite: GLOBALS.defaultButtonPressedImage,
      corners: [
        { x: 6, y: 5 },
        { x: 6, y: 5 },
        { x: 5, y: 5 },
        { x: 5, y: 5 },
      ],
    });
    this.pressedTranlation = { x: 0, y: 4 };
    this.state = "default";
    this.prevState = "default";
  }
  render() {
    GLOBALS.ctx.save();
    GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
    GLOBALS.ctx.translate(this.position.x, this.position.y);

    switch (this.state) {
      case "default":
        this.defaultImage.render();
        break;
      case "hover":
        if (this.hoverImage) {
          this.hoverImage.render();
        } else {
          this.defaultImage.render();
        }
        break;
      case "pressed":
        if (this.pressedImage) {
          GLOBALS.ctx.save();
          GLOBALS.ctx.translate(
            this.pressedTranlation.x,
            this.pressedTranlation.y
          );
          this.pressedImage.render();
        } else {
          this.defaultImage.render();
        }
        break;
    }

    GLOBALS.ctx.font = "bold 42px Arial";
    GLOBALS.ctx.fillStyle = "161715";

    const textMeasure = GLOBALS.ctx.measureText(this.text);
    GLOBALS.ctx.fillText(
      this.text,
      this.dimensions.width / 2 - textMeasure.width / 2,
      this.dimensions.height / 2 +
        (textMeasure.actualBoundingBoxAscent +
          textMeasure.actualBoundingBoxDescent) /
          2
    );
    this.prevState = this.state;
    GLOBALS.ctx.restore();
  }

  onPressed() {}

  onRelease() {}

  onReject() {}

  update(delta) {
    const bb = this.getBoundingBox();
    //check if mouse is in button bounding box
    if (
      (bb.x <= GLOBALS.mouse.x &&
        GLOBALS.mouse.x <= bb.x + bb.width &&
        bb.y <= GLOBALS.mouse.y &&
        GLOBALS.mouse.y <= bb.y + bb.height) ||
      (bb.x <= GLOBALS.touch.x &&
        GLOBALS.touch.x <= bb.x + bb.width &&
        bb.y <= GLOBALS.touch.y &&
        GLOBALS.touch.y <= bb.y + bb.height &&
        GLOBALS.touch.active)
    ) {
      if (
        GLOBALS.mouse.justClicked ||
        (this.state === "pressed" && GLOBALS.mouse.down) ||
        GLOBALS.touch.active
      ) {
        this.state = "pressed";
        if (this.prevState !== "pressed") {
          this.onPressed();
        }
      } else {
        this.state = "hover";
        if (this.prevState === "pressed") {
          this.onRelease();
        }
      }
    } else {
      this.state = "default";
      if (this.prevState === "pressed") {
        this.onReject();
      }
    }
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

export default ShellriderButton;
