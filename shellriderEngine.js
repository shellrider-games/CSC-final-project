class ShellriderEngine {
    canvas;
    ctx;
    mouse;
    canvasSize;
    scaleFactor;
    gameLoop = function() {
        console.log("gameLoop is not set");
    }

    constructor(canvas, canvasSize = {width: 720, height: 1280}, virtualScreenSize = {width: 720, height: 1280}){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.canvasSize = canvasSize;
        this.virtualScreenSize = virtualScreenSize;
        this.scaleFactor = {x: this.canvasSize.width/this.virtualScreenSize.width, y: this.canvasSize.height/this.virtualScreenSize.height};
        this.mouse = {
            x: 0,
            y: 0,
        }
    }
    
    updateCanvasSize(){
        this.canvas.setAttribute("width", this.canvasSize.width);
        this.canvas.setAttribute("height", this.canvasSize.height);
        this.scaleFactor = {x: this.canvasSize.width/this.virtualScreenSize.width, y: this.canvasSize.height/this.virtualScreenSize.height};
    }
    
    engineLoop(){
        this.updateCanvasSize();
        this.gameLoop();
        requestAnimationFrame(() => {this.engineLoop()});
    }
    
    initMouse(){
        document.onmousemove = (event) => {
            const canvasBounds = this.canvas.getBoundingClientRect();
            this.mouse.x = event.clientX - canvasBounds.left;
            this.mouse.y = event.clientY - canvasBounds.top;
        }
    }

    init(){
        this.initMouse();
    }

    run(){
        window.requestAnimationFrame(() => {this.engineLoop()});
    }
}

export default ShellriderEngine;