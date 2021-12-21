class Sprite {
    width;
    height;
    image;
    constructor(imageSrc , width, height) {
        this.image = new Image();
        this.image.src = imageSrc;
        if(typeof width === 'number') { this.width = width} else {this.width = this.image.naturalWidth};
        if(typeof height === 'number') { this.height = height} else {this.height = this.image.naturalWidth};
    }
}

export default Sprite;