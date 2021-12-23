class ShellPhysicsEngine{
    constructor() {

    }

    collideBB(boundingBox1, boundingBox2) {
        return (
            boundingBox1.x < boundingBox2.x + boundingBox2.width &&
            boundingBox1.x + boundingBox1.width > boundingBox2.x &&
            boundingBox1.y < boundingBox2.y + boundingBox2.height &&
            boundingBox1.y + boundingBox1.height > boundingBox2.y
        );
    }

    collide(body1, body2) {
        return this.collideBB(body1.getBoundingBox(), body2.getBoundingBox());
    }
}

export default ShellPhysicsEngine;