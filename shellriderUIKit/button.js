import Actor from "../actor.js";
import { GLOBALS } from "../shellriderEngineGlobals.js";

class ShellriderButton extends Actor {
  sliceSprite;
  position;
  dimensions;

  constructor(
    x,
    y,
    width,
    height,
    sliceSprite = {
      sprite: GLOBALS.defaultButtonImage,
      corners: [
        { x: 6, y: 5 },
        { x: 6, y: 5 },
        { x: 5, y: 9 },
        { x: 5, y: 9 },
      ],
    }
  ) {
    super();
    this.sliceSprite = sliceSprite;
    this.position = { x: x, y: y };
    this.dimensions = { width: width, height: height };
  }

  render() {
    GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
    GLOBALS.ctx.translate(this.position.x, this.position.y);
    //top left
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      0,
      0,
      this.sliceSprite.corners[0].x,
      this.sliceSprite.corners[0].y,
      0,
      0,
      (this.dimensions.width / this.sliceSprite.sprite.width) *
        this.sliceSprite.corners[0].x,
      (this.dimensions.height / this.sliceSprite.sprite.height) *
        this.sliceSprite.corners[0].y
    );
    //top middle
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      this.sliceSprite.corners[0].x,
      0,
      this.sliceSprite.sprite.width -
        this.sliceSprite.corners[0].x -
        this.sliceSprite.corners[1].x,
      this.sliceSprite.corners[0].y,
      (this.dimensions.width / this.sliceSprite.sprite.width) *
        this.sliceSprite.corners[0].x,
      0,
      (this.dimensions.width / this.sliceSprite.sprite.width) *
        this.sliceSprite.sprite.width -
        this.sliceSprite.corners[0].x -
        this.sliceSprite.corners[1].x,
      (this.dimensions.height / this.sliceSprite.sprite.height) *
        this.sliceSprite.corners[0].y
    );
    //top right
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      this.sliceSprite.sprite.width - this.sliceSprite.corners[1].x,
      0,
      this.sliceSprite.corners[1].x,
      this.sliceSprite.corners[1].y,
      (this.dimensions.width / this.sliceSprite.sprite.width) *
      this.sliceSprite.sprite.width - this.sliceSprite.corners[1].x,
      0,
      (this.dimensions.width / this.sliceSprite.sprite.width) *
        this.sliceSprite.corners[1].x,
      (this.dimensions.height / this.sliceSprite.sprite.height) *
        this.sliceSprite.corners[1].y
    );
  }
}

export default ShellriderButton;
