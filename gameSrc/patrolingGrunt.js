import EnemyGrunt from "./enemyGrunt.js";

//enemy that toggles between a list of waypoints
class PatrolingGrunt extends EnemyGrunt {
  wayPoints;
  currentTargetPoint;
  constructor(x, y, wayPoints = []) {
    super(x, y);
    if (wayPoints.length >= 1) {
      this.target = wayPoints[0];
      this.currentTargetPoint = 0;
    }
    this.wayPoints = wayPoints;
  }

  update(delta) {
    super.update(delta);
    if (
      this.position.x === this.target.x &&
      this.position.y === this.target.y
    ) {
      this.currentTargetPoint =
        (this.currentTargetPoint + 1) % this.wayPoints.length;
      this.target = this.wayPoints[this.currentTargetPoint];
    }
  }
}

export default PatrolingGrunt;