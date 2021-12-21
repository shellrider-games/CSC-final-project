import Actor from "./actor.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";

class ShellriderEngine {
  actors;
  lastTimestamp;
  preUpdates = function () {};
  postUpdates = function () {};
  preRenders = function () {};
  postRenders = function () {};

  constructor(
    canvas,
    canvasSize = { width: 720, height: 1280 },
    virtualScreenSize = { width: 720, height: 1280 }
  ) {
    if (canvas) { //if no canvas is given engine can run in canvasless mode -- used for
      GLOBALS.canvas = canvas;
      GLOBALS.ctx = canvas.getContext("2d");
      GLOBALS.canvasSize = canvasSize;
      GLOBALS.virtualScreenSize = virtualScreenSize;
      GLOBALS.scaleFactor = {
        x: GLOBALS.canvasSize.width / GLOBALS.virtualScreenSize.width,
        y: GLOBALS.canvasSize.height / GLOBALS.virtualScreenSize.height,
      };
      GLOBALS.mouse = {
        x: 0,
        y: 0,
      };
    }
    this.actors = [];
  }

  addActor(actor) {
    actor instanceof Actor
      ? this.actors.push(actor)
      : console.error(`${actor} is not of type 'Actor'`);
  }

  removeActor(actor) {
    if (this.actors.includes(actor)) {
      this.actors.slice(this.actors.indexOf(actor), 1);
    }
  }

  updateCanvasSize() {
    GLOBALS.canvas.setAttribute("width", GLOBALS.canvasSize.width);
    GLOBALS.canvas.setAttribute("height", GLOBALS.canvasSize.height);
    GLOBALS.scaleFactor = {
      x: GLOBALS.canvasSize.width / GLOBALS.virtualScreenSize.width,
      y: GLOBALS.canvasSize.height / GLOBALS.virtualScreenSize.height,
    };
  }

  engineLoop() {
    const delta = performance.now() - this.lastTimestamp;
    this.lastTimestamp = performance.now();
    this.updateCanvasSize();

    this.preUpdates();
    this.actors.forEach((actor) => {
      actor.update(delta);
    });
    this.postUpdates();
    this.preRenders();
    this.actors.forEach((actor) => {
      actor.render();
    });
    this.postRenders();

    requestAnimationFrame(() => {
      this.engineLoop();
    });
  }

  initMouse() {
    document.onmousemove = (event) => {
      const canvasBounds = GLOBALS.canvas.getBoundingClientRect();
      GLOBALS.mouse.x = event.clientX - canvasBounds.left;
      GLOBALS.mouse.y = event.clientY - canvasBounds.top;
    };
  }

  init() {
    this.initMouse();
  }

  run() {
    this.lastTimestamp = performance.now();
    window.requestAnimationFrame(() => {
      this.engineLoop();
    });
  }
}

export default ShellriderEngine;
