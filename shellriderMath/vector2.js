class Vector2 {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  //returns a new Vector2 rotated by angle in radians
  rotate(angle) {
    return new Vector2(
      Math.cos(angle) * this.x - Math.sin(angle) * this.y,
      Math.sin(angle) * this.x + Math.cos(angle) * this.y
    );
  }
}

export default Vector2;
