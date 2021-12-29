import Vector2 from "./shellriderMath/vector2.js";

class ScreenShaker {
  velocity;
  lastPosition;
  shakePosition;
  stiffness;
  dampening;

  constructor(stiffness = 5000, dampening = 25) {
    this.shakePosition = new Vector2(0, 0);
    this.lastPosition = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.stiffness = stiffness;
    this.dampening = dampening;
  }

  update(delta) {
    const springForce = new Vector2(
      -this.stiffness * this.shakePosition.x -
        (this.dampening * (this.shakePosition.x - this.lastPosition.x)) / delta,
      -this.stiffness * this.shakePosition.y -
        (this.dampening * (this.shakePosition.y - this.lastPosition.y)) / delta
    );

    this.velocity.x = this.velocity.x + springForce.x * delta;
    this.velocity.y = this.velocity.y + springForce.y * delta;

    this.lastPosition.x = this.shakePosition.x;
    this.lastPosition.y = this.shakePosition.y;

    this.shakePosition.x = this.shakePosition.x + this.velocity.x*delta;
    this.shakePosition.y = this.shakePosition.y + this.velocity.y*delta;

    if(springForce.x <= 0.1 && springForce.x >= -0.1 && springForce.y <= 0.1 && springForce.y >= -0.1){
        this.lastPosition.x = 0;
        this.lastPosition.y = 0;
        this.shakePosition.x = 0;
        this.shakePosition.y = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
  }

  putAtPositon(x,y){
      this.shakePosition.x = x;
      this.shakePosition.y = y;
      this.lastPosition.x = x;
      this.lastPosition.y = y;
      this.velocity.x = 0;
      this.velocity.y = 0;
  }
}

export default ScreenShaker;