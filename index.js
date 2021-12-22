import ShellriderEngine from "./shellriderEngine.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";
import StaticBody from "./staticBody.js";


window.onload = async () => {
    const canvas = document.querySelector("#gameCanvas");
    const engine = new ShellriderEngine(canvas);
    
    engine.init();
    
    engine.preUpdates = () => {
        GLOBALS.canvasSize.height = Math.min(window.innerWidth/9*16,window.innerHeight) 
        GLOBALS.canvasSize.width = Math.min(window.innerHeight/16*9,window.innerWidth);
    }
    const playerShip = new StaticBody(0,GLOBALS.virtualScreenSize.height-120,99,75);
    playerShip.sprite = await engine.requestSprite("./assets/img/playerShip1_red.png");

    playerShip.speed = 400;
    playerShip.update = (delta) => {
        let goalX;
        if (GLOBALS.touch.active) {
            goalX =  Math.min(Math.max(GLOBALS.touch.x-playerShip.dimensions.width/2,0),GLOBALS.virtualScreenSize.width - playerShip.dimensions.width);
            GLOBALS.mouse.x = goalX;
        } else {
            goalX = Math.min(Math.max(GLOBALS.mouse.x-playerShip.dimensions.width/2,0),GLOBALS.virtualScreenSize.width - playerShip.dimensions.width);
        }

Math.min(Math.max(GLOBALS.mouse.x-playerShip.dimensions.width/2,0),GLOBALS.virtualScreenSize.width - playerShip.dimensions.width);

        goalX > playerShip.position.x ? playerShip.position.x = Math.min(playerShip.position.x + (playerShip.speed*delta),goalX) : playerShip.position.x = Math.max(playerShip.position.x - (playerShip.speed*delta),goalX);
    }
    
    
    engine.addActor(playerShip);
    
    engine.run();
}
