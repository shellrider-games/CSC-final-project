import ShellriderEngine from "./shellriderEngine.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";
import { randomNumberBetween } from "./toolBox.js";
import StaticBody from "./staticBody.js";
import Actor from "./actor.js";
import Scene from "./scene.js";

window.toggleDebug = function () {
  GLOBALS.debug = !GLOBALS.debug;
  return GLOBALS.debug;
};

window.onload = async () => {
  let vh = window.innerHeight * 0.01;
  document.body.style.setProperty("--vh", `${vh}px`);

  window.addEventListener("resize", () => {
    let vh = window.innerHeight * 0.01;
    document.body.style.setProperty("--vh", `${vh}px`);
  });

  const canvas = document.querySelector("#gameCanvas");
  const engine = new ShellriderEngine(canvas);
  const fullSreenButton = document.querySelector("#fullscreen");

  function canvasFullscreen() {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      document.body.webkitRequestFullscreen();
    }
  }

  document.body.addEventListener("fullscreenchange", (event) => {
    if (document.fullscreenElement) {
      fullSreenButton.style.display = "none";
    } else {
      fullSreenButton.style.display = "block";
    }
  });

  fullSreenButton.addEventListener("click", canvasFullscreen);

  engine.init();

  const spaceGameScene = new Scene();

  await engine.audio.loadSound(
    "./assets/audio/effects/explosion.wav",
    "explosion"
  );
  await engine.audio.loadSound("./assets/audio/effects/laser.wav", "laser");
  const asteroids = [];
  const playerShots = [];
  const asteroidSprite = await engine.requestSprite(
    "./assets/img/meteorGrey_big1.png"
  );
  const laserShotSprite = await engine.requestSprite("./assets/img/laserGreen13.png");

  class LevelStep extends Actor{
    next;
    constructor(update = function(delta){}){
      super();
      this.update = update;
      this.next = false;
    }
  }

  class LevelScript extends Actor{
    steps;
    currentIndex;
    constructor(steps = [], currentIndex = -1){
      super();
      this.steps = steps;
      this.currentIndex = currentIndex;
    }
    update(delta){
      if(this.currentIndex < this.steps.length-1){
        if(this.currentIndex < 0 && this.steps.length >= 1){
          this.currentIndex = 0;
          engine.addActor(this.steps[0]);
        }
        if(this.steps[this.currentIndex].next){
          engine.addActor(this.steps[++this.currentIndex]);
        }
      }
    }
  }

  const waitStep = new LevelStep((delta)=> {
    waitStep.timePassed += delta;
    if(waitStep.timePassed >= 0.5){
      waitStep.next = true;
      engine.removeActor(waitStep);
    }
  });
  waitStep.timePassed = 0;

  const asteroidStep = new LevelStep((delta)=>{
    const asteroidGenerator = new AsteroidGenerator();
    engine.addActor(asteroidGenerator);
    engine.removeActor(asteroidStep);
    asteroidStep.next = true;
  });

  const spaceGameScript = new LevelScript([waitStep,asteroidStep]);

  class Asteroid extends StaticBody {
    constructor(x, y, width = 101, height = 84) {
      super(x, y, width, height);
      this.sprite = asteroidSprite;
    }

    update(delta) {
      this.position.y += 300 * delta;
      if (this.position.y >= GLOBALS.virtualScreenSize.height + 200) {
        asteroids.splice(asteroids.indexOf(this), 1);
        engine.removeActor(this);
      }
    }
  }

  const canvasAutoAdjust = function () {
    GLOBALS.canvasSize.height =
      Math.min((window.innerWidth / 9) * 16, window.innerHeight) - 1;
    GLOBALS.canvasSize.width =
      Math.min((window.innerHeight / 16) * 9, window.innerWidth) - 1;
  };

  spaceGameScene.preUpdates = () => {
    canvasAutoAdjust();
  };

  spaceGameScene.postUpdates = () => {
    asteroids.forEach((asteroid) => {
      if (engine.physics.collide(asteroid, playerShip)) {
        engine.audio.play("explosion");
        asteroids.splice(asteroids.indexOf(asteroid), 1);
        engine.removeActor(asteroid);
      }
      playerShots.forEach((shot) => {
        if (engine.physics.collide(asteroid,shot)) {
          playerShots.splice(playerShots.indexOf(shot),1);
          engine.removeActor(shot);
        }
      })
    });
  };

  class PlayerShot extends StaticBody {
    constructor(x,y,width = 9,height = 37) {
      super(x,y,width,height);
      this.sprite = laserShotSprite;
    }
    update(delta) {
      this.position.y -= 1000 * delta;
      if (this.position.y <= -200) {
        playerShots.splice(playerShots.indexOf(this), 1);
        engine.removeActor(this);
      }
    }

  }

  const playerShip = new StaticBody(
    0,
    GLOBALS.virtualScreenSize.height - 220,
    99,
    75
  );
  playerShip.sprite = await engine.requestSprite(
    "./assets/img/playerShip1_red.png"
  );

  playerShip.speed = 500;
  playerShip.shotDelay = 0;
  playerShip.getBoundingBox = () => {
    let bb = {
      x: playerShip.position.x,
      y: playerShip.position.y + 25,
      width: playerShip.dimensions.width,
      height: playerShip.dimensions.height - 40,
    };
    return bb;
  };
  playerShip.update = (delta) => {
    let goalX;
    playerShip.shotDelay = Math.max(playerShip.shotDelay - delta, 0);

    if (GLOBALS.touch.active) {
      goalX = Math.min(
        Math.max(GLOBALS.touch.x - playerShip.dimensions.width / 2, 0),
        GLOBALS.virtualScreenSize.width - playerShip.dimensions.width
      );
      GLOBALS.mouse.x = goalX;
    } else {
      goalX = Math.min(
        Math.max(GLOBALS.mouse.x - playerShip.dimensions.width / 2, 0),
        GLOBALS.virtualScreenSize.width - playerShip.dimensions.width
      );
    }

    Math.min(
      Math.max(GLOBALS.mouse.x - playerShip.dimensions.width / 2, 0),
      GLOBALS.virtualScreenSize.width - playerShip.dimensions.width
    );

    goalX > playerShip.position.x
      ? (playerShip.position.x = Math.min(
          playerShip.position.x + playerShip.speed * delta,
          goalX
        ))
      : (playerShip.position.x = Math.max(
          playerShip.position.x - playerShip.speed * delta,
          goalX
        ));
    
    if((GLOBALS.touch.active || GLOBALS.mouse.down) && playerShip.shotDelay === 0){
      const newShot = new PlayerShot(playerShip.position.x + playerShip.dimensions.width/2 - laserShotSprite.width/2, playerShip.position.y  - playerShip.dimensions.height/2);
      playerShip.shotDelay = 0.25;
      engine.audio.play("laser");
      playerShots.push(newShot);
      engine.addActor(newShot);
    }
  };

  class AsteroidGenerator extends Actor {
    timeTracker;
    nextSpawn;
    constructor() {
      super();
      this.timeTracker = 0;
      this.nextSpawn = randomNumberBetween(250, 750) / 1000;
    }
    update(delta) {
      this.timeTracker += delta;
      if (this.timeTracker >= this.nextSpawn) {
        const asteroid = new Asteroid(
          randomNumberBetween(0, GLOBALS.virtualScreenSize.width - 101),
          -100
        );
        asteroids.push(asteroid);
        engine.addActor(asteroid);
        this.timeTracker = 0; //at zero to prevent multiple spawns on window focus
        this.nextSpawn = randomNumberBetween(250, 750) / 1000;
      }
    }
  }

  spaceGameScene.actors.push(playerShip);
  spaceGameScene.actors.push(spaceGameScript);

  const startScene = new Scene();
  startScene.preUpdates = () => {
    canvasAutoAdjust();
  };
  startScene.postRenders = () => {
    GLOBALS.ctx.fillStyle = "#efefef";
    GLOBALS.ctx.font = `42px Arial`;
    const txt = "Click/Touch to Start";
    GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
    GLOBALS.ctx.fillText(
      txt,
      GLOBALS.virtualScreenSize.width / 2 -
        GLOBALS.ctx.measureText(txt).width / 2,
      GLOBALS.virtualScreenSize.height / 2
    );
    GLOBALS.ctx.resetTransform();
  };
  startScene.postUpdates = () => {
    if (GLOBALS.mouse.down || GLOBALS.touch.active) {
      engine.loadScene(spaceGameScene);
    }
  };

  engine.loadScene(startScene);
};
