import ShellriderEngine from "./shellriderEngine.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";
import Sprite from "./sprite.js";
import StaticBody from "./staticBody.js";


window.onload = () => {
    const canvas = document.querySelector("#gameCanvas");
    const engine = new ShellriderEngine(canvas);
    
    engine.init();
    
    engine.preUpdates = () => {
        GLOBALS.canvasSize.height = Math.min(window.innerWidth/9*16,window.innerHeight) 
        GLOBALS.canvasSize.width = Math.min(window.innerHeight/16*9,window.innerWidth);
    }
    const testStaticBody = new StaticBody(100,GLOBALS.virtualScreenSize.height-120,100,100);
    testStaticBody.update = (delta) => {
        testStaticBody.position.x = (testStaticBody.position.x + (300*delta)) % GLOBALS.virtualScreenSize.width;
    }
    testStaticBody.sprite = new Sprite("./assets/img/playerShip1_red.png")
    engine.addActor(testStaticBody);
    
    engine.run();
}
