class Scene {
  actors;

  constructor(actors = []) {
    this.actors = actors;
  }
  preUpdates() {}
  postUpdates() {}
  preRenders() {}
  postRenders() {}
  postUpdates() {}
  onSceneEntry() {}
}

export default Scene;
