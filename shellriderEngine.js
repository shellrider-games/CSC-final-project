import Actor from "./actor.js";
import ShellAudioSystem from "./shellAudioSystem.js";
import ShellPhysicsEngine from "./shellPhysicsEngine.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";
import Sprite from "./sprite.js";
import Scene from "./scene.js";

class ShellriderEngine {
  actors;
  lastTimestamp;
  physics;
  audio;
  currentScene;

  constructor(
    canvas,
    canvasSize = { width: 720, height: 1280 },
    virtualScreenSize = { width: 720, height: 1280 }
  ) {
    if (canvas) {
      //if no canvas is given engine can run in canvasless mode -- used for testing with jest
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
        down: false,
      };
      GLOBALS.touch = {
        x: 0,
        y: 0,
        active: false,
      };
    }
    this.physics = new ShellPhysicsEngine();
    this.audio = new ShellAudioSystem();
    this.actors = [];
  }

  addActor(actor) {
    actor instanceof Actor
      ? this.actors.push(actor)
      : console.error(`${actor} is not of type 'Actor'`);
  }

  removeActor(actor) {
    if (this.actors.includes(actor)) {
      this.actors.splice(this.actors.indexOf(actor), 1);
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
    if (!GLOBALS.pause) {
      const delta = (performance.now() - this.lastTimestamp) / 1000; //time passed in seconds
      this.lastTimestamp = performance.now();
      this.updateCanvasSize();

      this.currentScene.preUpdates();
      this.actors.forEach((actor) => {
        actor.update(delta);
      });
      this.currentScene.postUpdates();
      this.currentScene.preRenders();
      this.actors.forEach((actor) => {
        actor.render();
      });
      this.currentScene.postRenders();

      GLOBALS.mouse.justClicked = false;
      requestAnimationFrame(() => {
        this.engineLoop();
      });
    }
  }

  initMouse() {
    document.onmousemove = (event) => {
      const canvasBounds = GLOBALS.canvas.getBoundingClientRect();
      GLOBALS.mouse.x =
        (event.clientX - canvasBounds.left) / GLOBALS.scaleFactor.x;
      GLOBALS.mouse.y =
        (event.clientY - canvasBounds.top) / GLOBALS.scaleFactor.y;
    };
    document.onmousedown = () => {
      GLOBALS.mouse.down = true;
      GLOBALS.mouse.justClicked = true;
    };
    document.onmouseup = () => {
      GLOBALS.mouse.down = false;
    }
  }

  initTouch() {
    const updateTouchPosition = (event) => {
      const touchList = event.changedTouches;
      const canvasBounds = GLOBALS.canvas.getBoundingClientRect();
      GLOBALS.touch.x =
        (touchList[0].clientX - canvasBounds.left) / GLOBALS.scaleFactor.x;
      GLOBALS.touch.y =
        (touchList[0].clientX - canvasBounds.left) / GLOBALS.scaleFactor.x;
      GLOBALS.touch.active = true;
    };
    document.ontouchstart = updateTouchPosition;
    document.ontouchmove = updateTouchPosition;
    document.ontouchend = (event) => {
      updateTouchPosition(event);
      GLOBALS.touch.active = false;
    };
  }

  async initUIKit(){
    GLOBALS.defaultButtonImage = await this.requestSprite("./engine_assets/img/grey_button10.png");
  }

  init() {
    this.initMouse();
    this.initTouch();
    this.initUIKit();
  }

  loadScene(scene) {
    const sceneCopy = scene;
    if (scene instanceof Scene) {
      GLOBALS.pause = true;
      this.currentScene = sceneCopy;
      sceneCopy.onSceneEntry();
      this.actors = sceneCopy.actors;
      this.run();
    }
  }

  run() {
    this.lastTimestamp = performance.now();
    GLOBALS.pause = false;
    window.requestAnimationFrame(() => {
      this.engineLoop();
    });
  }

  async requestSprite(filepath, width, height) {
    const sprite = new Sprite(filepath, width, height);
    await sprite.loadImage();
    return sprite;
  }
}

export default ShellriderEngine;
