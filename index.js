import ShellriderEngine from "./shellriderEngine.js";
import Actor from "./actor.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";

const canvas = document.querySelector("#gameCanvas");
const engine = new ShellriderEngine(canvas);

engine.init();

engine.preUpdates = () => {
    GLOBALS.canvasSize.height = Math.min(window.innerWidth/9*16,window.innerHeight) 
    GLOBALS.canvasSize.width = Math.min(window.innerHeight/16*9,window.innerWidth);
}
engine.run();