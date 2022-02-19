import Actor from "../engineSrc/actor.js";

/*
* class to keep track where in the level the player is rn
*/
class LevelStep extends Actor {
  next;
  constructor(update = function (delta) {}) {
    super();
    this.update = update;
    this.next = false;
  }
}

export default LevelStep;
