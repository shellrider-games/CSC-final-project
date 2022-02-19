import { GLOBALS } from "./shellriderEngineGlobals.js";

/*
* Class to store data and render a nine slice image, useful for buttons.
* See https://en.wikipedia.org/wiki/9-slice_scaling for info on 9-slicing
*/ 
class NineSliceImage {
  sliceSprite;
  dimensions;

  constructor(
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
    this.sliceSprite = sliceSprite;
    this.dimensions = { width: width, height: height };
  }

  render() {
    //top left
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      0,
      0,
      this.sliceSprite.corners[0].x,
      this.sliceSprite.corners[0].y,
      0,
      0,
      this.sliceSprite.corners[0].x,
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
      this.sliceSprite.corners[0].x,
      0,
      this.dimensions.width -
        this.sliceSprite.corners[0].x -
        this.sliceSprite.corners[1].x,
      this.sliceSprite.corners[0].y
    );
    //top right
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      this.sliceSprite.sprite.width - this.sliceSprite.corners[1].x,
      0,
      this.sliceSprite.corners[1].x,
      this.sliceSprite.corners[1].y,
      this.dimensions.width - this.sliceSprite.corners[1].x,
      0,
      this.sliceSprite.corners[1].x,
      this.sliceSprite.corners[1].y
    );
    //middleleft
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      0,
      this.sliceSprite.corners[0].y,
      this.sliceSprite.corners[0].x,
      this.sliceSprite.sprite.height -
        this.sliceSprite.corners[0].y -
        this.sliceSprite.corners[2].y,
      0,
      this.sliceSprite.corners[0].y,
      this.sliceSprite.corners[0].x,
      this.dimensions.height -
        this.sliceSprite.corners[0].y -
        this.sliceSprite.corners[2].y
    );
    //middle
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      this.sliceSprite.corners[0].x,
      this.sliceSprite.corners[0].y,
      this.sliceSprite.sprite.width -
        this.sliceSprite.corners[0].x -
        this.sliceSprite.corners[1].x,
      this.sliceSprite.sprite.height -
        this.sliceSprite.corners[0].y -
        this.sliceSprite.corners[2].y,
      this.sliceSprite.corners[0].x,
      this.sliceSprite.corners[0].y,
      this.dimensions.width -
        this.sliceSprite.corners[0].x -
        this.sliceSprite.corners[1].x,
      this.dimensions.height -
        this.sliceSprite.corners[0].y -
        this.sliceSprite.corners[2].y
    );
    //middleright
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      this.sliceSprite.sprite.image.width - this.sliceSprite.corners[1].x,
      this.sliceSprite.corners[1].y,
      this.sliceSprite.corners[3].x,
      this.sliceSprite.sprite.height -
        this.sliceSprite.corners[1].y -
        this.sliceSprite.corners[3].y,
      this.dimensions.width - this.sliceSprite.corners[1].x,
      this.sliceSprite.corners[0].y,
      this.sliceSprite.corners[0].x,
      this.dimensions.height -
        this.sliceSprite.corners[0].y -
        this.sliceSprite.corners[2].y
    );
    //bottom left
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      0,
      this.sliceSprite.sprite.height - this.sliceSprite.corners[2].y,
      this.sliceSprite.corners[2].x,
      this.sliceSprite.corners[2].y,
      0,
      this.dimensions.height - this.sliceSprite.corners[2].y,
      this.sliceSprite.corners[2].x,
      this.sliceSprite.corners[2].y
    );
    //bottom middle
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      this.sliceSprite.corners[2].x,
      this.sliceSprite.sprite.height - this.sliceSprite.corners[2].y,
      this.sliceSprite.sprite.width -
        this.sliceSprite.corners[2].x -
        this.sliceSprite.corners[3].x,
      this.sliceSprite.corners[2].y,
      this.sliceSprite.corners[2].x,
      this.dimensions.height - this.sliceSprite.corners[2].y,
      this.dimensions.width -
        this.sliceSprite.corners[2].x -
        this.sliceSprite.corners[3].x,
      this.sliceSprite.corners[2].y
    );

    //bottom right
    GLOBALS.ctx.drawImage(
      this.sliceSprite.sprite.image,
      this.sliceSprite.sprite.width - this.sliceSprite.corners[3].x,
      this.sliceSprite.sprite.height - this.sliceSprite.corners[3].y,
      this.sliceSprite.corners[3].x,
      this.sliceSprite.corners[3].y,
      this.dimensions.width - this.sliceSprite.corners[3].x,
      this.dimensions.height - this.sliceSprite.corners[3].y,
      this.sliceSprite.corners[3].x,
      this.sliceSprite.corners[3].y
    );
  }
}

export default NineSliceImage;
