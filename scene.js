class Scene {
    actors;
    preUpdates;
    postUpdates;
    preRenders;
    postRenders;

    constructor(actors = [], preUpdates = function(){} ,postUpdates = function(){}, preRenders = function(){}, postRenders= function(){}) {
        this.actors = actors;
        this.preUpdates = preUpdates;
        this.postUpdates = postUpdates;
        this.preRenders = preRenders;
        this.postRenders = postRenders;
    }
}

export default Scene;