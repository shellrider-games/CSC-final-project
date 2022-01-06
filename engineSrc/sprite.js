class Sprite {
  width;
  height;
  image;
  constructor(imageSrc, width, height) {
    this.image = new Image();
    this.image.src = imageSrc;
    if (typeof width === "number") {
      this.width = width;
    }
    if (typeof height === "number") {
      this.height = height;
    }
  }

  loadImage() {
    return new Promise((resolve, reject) => {
      this.image.onload = () => {
        if (typeof this.width !== "number") {
          this.width = this.image.naturalWidth;
        }
        if (typeof this.height !== "number") {
          this.height = this.image.naturalHeight;
        }
        resolve();
      };
    });
  }
}

export default Sprite;
