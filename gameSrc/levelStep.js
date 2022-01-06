import Actor from "../engineSrc/actor.js";

class LevelStep extends Actor {
  next;
  constructor(update = function (delta) {}) {
    super();
    this.update = update;
    this.next = false;
  }
}

export default LevelStep;
