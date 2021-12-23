class ShellAudioSystem {
    soundbank;

    constructor() {
        this.soundbank = {};
    };

    loadSound(path,name) {
        const audio = new Audio(path);
        const sb = this.soundbank; //we need this here because we can't use an anonymous function below since we want to only fire the event once
        return new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', function handlePlayThroughEvent() {
                sb[name] = audio;
                resolve("clip loaded");
                audio.removeEventListener('canplaythrough', handlePlayThroughEvent);
            }); 
        });
    }

    play(name){
        if(this.soundbank[name].paused) {
            this.soundbank[name].play();
        } else {
            this.soundbank[name].currentTime = 0;
        }
        
    }
}

export default ShellAudioSystem;