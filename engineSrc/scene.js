//abstract class with all the functions a Scene for the ShellriderEngine needs

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
