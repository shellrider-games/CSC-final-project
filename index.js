import ShellriderEngine from "./shellriderEngine.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";
import { randomNumberBetween } from "./toolBox.js";
import StaticBody from "./staticBody.js";
import Actor from "./actor.js";

window.toggleDebug = function () {
  GLOBALS.debug = !GLOBALS.debug;
  return GLOBALS.debug;
};

window.onload = async () => {
  let vh = window.innerHeight * 0.01;
  document.body.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
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

  await engine.audio.loadSound("./assets/audio/effects/explosion.wav", "explosion");

  const asteroids = [];

  const asteroidSprite = await engine.requestSprite(
    "./assets/img/meteorGrey_big1.png"
  );

  class Asteroid extends StaticBody {
    constructor(x, y, width = 101, height = 84) {
      super(x, y, width, height);
      this.sprite = asteroidSprite;
    }

    update(delta) {
      this.position.y += 300 * delta;
      if (this.position.y >= GLOBALS.virtualScreenSize.height + 200) {
        asteroids.splice(asteroids.indexOf(this),1);
        engine.removeActor(this);
      }
    }
  }

  engine.preUpdates = () => {
    GLOBALS.canvasSize.height = Math.min(
      (window.innerWidth / 9) * 16,
      window.innerHeight
    )-1 ;
    GLOBALS.canvasSize.width = Math.min(
      (window.innerHeight / 16) * 9,
      window.innerWidth
    )-1;
  };

  engine.postUpdates = () => {
    asteroids.forEach((asteroid) => {
      if(engine.physics.collide(asteroid, playerShip)){
        engine.audio.play("explosion");
        asteroids.splice(asteroids.indexOf(asteroid),1);
        engine.removeActor(asteroid);
      }
    });
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

  playerShip.speed = 400;
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
  };

  class AsteroidGenerator extends Actor {
    timeTracker;
    nextSpawn;
    constructor () {
      super();
      this.timeTracker = 0;
      this.nextSpawn = randomNumberBetween(250,750)/1000;
    }
    update(delta) {
      this.timeTracker += delta;
      if(this.timeTracker >= this.nextSpawn) {
        const asteroid = new Asteroid(
          randomNumberBetween(0, GLOBALS.virtualScreenSize.width - 101),-100
        );
        asteroids.push(asteroid);
        engine.addActor(asteroid);
        this.timeTracker = 0; //at zero to prevent multiple spawns on window focus
        this.nextSpawn = randomNumberBetween(250,750)/1000;
      }
    }

  }
  const asteroidGenerator = new AsteroidGenerator();

  engine.addActor(asteroidGenerator);
  engine.addActor(playerShip);
  engine.run();
};
