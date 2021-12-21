import ShellriderEngine from "./shellriderEngine.js";

const canvas = document.querySelector("#gameCanvas");
const engine = new ShellriderEngine(canvas);

engine.gameLoop = () => {
    engine.canvasSize.height = Math.min(window.innerWidth/9*16,window.innerHeight) 
    engine.canvasSize.width = Math.min(window.innerHeight/16*9,window.innerWidth);
    console.log(engine.scaleFactor);
}

engine.init();
engine.run();