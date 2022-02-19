class ShellAudioSystem {
  soundbank;

  constructor() {
    this.soundbank = {};
  }

  //load an Audiofile to create an Audio object and add it to the soundbank with a name. Return a promise for the engine to be able to wait for the audiofile to be playable before continiueing
  loadSound(path, name) {
    const audio = new Audio(path);
    const sb = this.soundbank; //we need this here because we can't use an anonymous function below since we want to only fire the event once
    return new Promise((resolve, reject) => {
      audio.addEventListener(
        "canplaythrough",
        function handlePlayThroughEvent() {
          sb[name] = audio;
          resolve("clip loaded");
          //remove Eventlistener after the clip is loaded enough
          audio.removeEventListener("canplaythrough", handlePlayThroughEvent);
        }
      );
    });
  }

  //play Audio stored in soundbank with key from start
  play(name) {
    if (this.soundbank[name].paused) {
      this.soundbank[name].play();
    } else {
      this.soundbank[name].currentTime = 0;
      this.soundbank[name].play();
    }
  }
}

export default ShellAudioSystem;
