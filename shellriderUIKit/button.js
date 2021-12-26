import Actor from '../actor.js'
import { GLOBALS } from '../shellriderEngineGlobals.js';

class ShellriderButton extends Actor {
    imageDefault;
    imageHover;
    imagePressed;
    state;
    
    constructor(imageDefault = GLOBALS.defaultButtonImage, imageHover, imagePressed){
        super();
        this.imageDefault = imageDefault;
        this.imageHover = imageHover;
        this.imagePressed = imagePressed;
        this.state = 'default';
    }
}

export default ShellriderButton;