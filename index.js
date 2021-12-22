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
    const playerShip = new StaticBody(100,GLOBALS.virtualScreenSize.height-120,100,100);
    playerShip.speed = 400;
    playerShip.update = (delta) => {
        const goalX = Math.min(Math.max(GLOBALS.mouse.x,0),GLOBALS.virtualScreenSize.width - playerShip.dimensions.width);

        goalX > playerShip.position.x ? playerShip.position.x = Math.min(playerShip.position.x + (playerShip.speed*delta),goalX) : playerShip.position.x = Math.max(playerShip.position.x - (playerShip.speed*delta),goalX);
    }
    playerShip.sprite = new Sprite("./assets/img/playerShip1_red.png")
    engine.addActor(playerShip);
    
    engine.run();
}
