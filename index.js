import ShellriderEngine from "./shellriderEngine.js";

const canvas = document.querySelector("#gameCanvas");
const context = canvas.getContext("2d");

const engine = new ShellriderEngine(canvas);

engine.gameLoop = () => {
    engine.canvasSize.width = window.innerWidth;
    engine.canvasSize.height = window.innerHeight;
}

engine.init();
engine.run();