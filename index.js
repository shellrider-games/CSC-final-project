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

  const canvasAutoAdjust = function () {
    GLOBALS.canvasSize.height =
      Math.min((window.innerWidth / 9) * 16, window.innerHeight) - 1;
    GLOBALS.canvasSize.width =
      Math.min((window.innerHeight / 16) * 9, window.innerWidth) - 1;
  };

  function canvasFullscreen() {
    if (document.body.requestFullscreen) {
      document.body.requestFullscreen();
    } else if (document.body.webkitRequestFullscreen) {
      document.body.webkitRequestFullscreen();
    }
  }

  canvasAutoAdjust();

  document.body.addEventListener("fullscreenchange", (event) => {
    if (document.fullscreenElement) {
      fullSreenButton.style.display = "none";
    } else {
      fullSreenButton.style.display = "block";
    }
  });

  fullSreenButton.addEventListener("click", canvasFullscreen);

  engine.init();

  await engine.audio.loadSound(
    "./assets/audio/effects/explosion.wav",
    "explosion"
  );
  await engine.audio.loadSound("./assets/audio/effects/laser.wav", "laser");
  await engine.audio.loadSound("./assets/audio/effects/hit.wav", "hit");
  await engine.audio.loadSound("./assets/audio/effects/hit_asteroid.wav", "hit_asteroid");
  let asteroids = [];
  let playerShots = [];
  let enemyShots = [];
  let onScreenEnemies = [];
  const asteroidSprite = await engine.requestSprite(
    "./assets/img/meteorGrey_big1.png"
  );
  const laserShotSprite = await engine.requestSprite(
    "./assets/img/laserGreen13.png"
  );
  const enemyGruntSprite = await engine.requestSprite(
    "./assets/img/enemyBlue1.png"
  );
  const enemyLaserSprite = await engine.requestSprite(
    "./assets/img/laserRed15.png"
  );
  const playerShipSprite = await engine.requestSprite(
    "./assets/img/playerShip1_red.png"
  );
  const shieldSprite = await engine.requestSprite("./assets/img/shield1.png");

  class LevelStep extends Actor {
    next;
    constructor(update = function (delta) {}) {
      super();
      this.update = update;
      this.next = false;
    }
  }

  class LevelScript extends Actor {
    steps;
    currentIndex;
    constructor(steps = [], currentIndex = -1) {
      super();
      this.steps = steps;
      this.currentIndex = currentIndex;
    }
    update(delta) {
      if (this.currentIndex < this.steps.length - 1) {
        if (this.currentIndex < 0 && this.steps.length >= 1) {
          this.currentIndex = 0;
          engine.addActor(this.steps[0]);
        }
        if (this.steps[this.currentIndex].next) {
          engine.addActor(this.steps[++this.currentIndex]);
        }
      }
    }
  }

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

  class PlayerShip extends StaticBody {
    speed;
    shotDelay;
    shield;
    nextShield;
    hitpoints;

    constructor(
      x = 0,
      y = GLOBALS.virtualScreenSize.height - 220,
      width = 99,
      height = 75
    ) {
      super(x, y, width, height);
      this.sprite = playerShipSprite;
      this.speed = 500;
      this.shotDelay = 0;
      this.shield = true;
      this.nextShield = 0;
      this.hitpoints = 1;
    }

    getBoundingBox() {
      let bb = {
        x: this.position.x,
        y: this.position.y + 25,
        width: this.dimensions.width,
        height: this.dimensions.height - 40,
      };
      return bb;
    }

    update(delta) {
      let goalX;
      this.shotDelay = Math.max(this.shotDelay - delta, 0);
      this.nextShield = Math.max(this.nextShield - delta, 0);

      if (GLOBALS.touch.active) {
        goalX = Math.min(
          Math.max(GLOBALS.touch.x - this.dimensions.width / 2, 0),
          GLOBALS.virtualScreenSize.width - this.dimensions.width
        );
        GLOBALS.mouse.x = goalX;
      } else {
        goalX = Math.min(
          Math.max(GLOBALS.mouse.x - this.dimensions.width / 2, 0),
          GLOBALS.virtualScreenSize.width - this.dimensions.width
        );
      }
      Math.min(
        Math.max(GLOBALS.mouse.x - this.dimensions.width / 2, 0),
        GLOBALS.virtualScreenSize.width - this.dimensions.width
      );

      goalX > this.position.x
        ? (this.position.x = Math.min(
            this.position.x + this.speed * delta,
            goalX
          ))
        : (this.position.x = Math.max(
            this.position.x - this.speed * delta,
            goalX
          ));

      if (
        (GLOBALS.touch.active || GLOBALS.mouse.down) &&
        this.shotDelay === 0
      ) {
        const newShot = new PlayerShot(
          this.position.x +
            this.dimensions.width / 2 -
            laserShotSprite.width / 2,
          this.position.y - this.dimensions.height / 2
        );
        this.shotDelay = 0.25;
        engine.audio.play("laser");
        playerShots.push(newShot);
        engine.addActor(newShot);
      }
      if (!this.shield && this.nextShield <= 0) {
        this.shield = true;
      }
    }
    render() {
      super.render();
      if (this.shield) {
        GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
        GLOBALS.ctx.translate(
          this.position.x + this.dimensions.width / 2 - shieldSprite.width / 2,
          this.position.y - 20
        );
        GLOBALS.ctx.drawImage(shieldSprite.image, 0, 0);
        GLOBALS.ctx.resetTransform();
      }
    }

    damage() {
      if (this.shield) {
        this.destroyShield();
      } else {
        this.hitpoints -= 1;
      }
    }

    destroyShield() {
      this.shield = false;
      this.nextShield = 10;
    }
  }

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

  class EnemyShot extends StaticBody {
    //default width and height are smaller than the sprite to make it easier for the player to evade
    constructor(x, y, width = 9, height = 37) {
      super(x, y, width, height);
      this.sprite = enemyLaserSprite;
    }
    update(delta) {
      this.position.y += 600 * delta;
      if (this.position.y >= GLOBALS.virtualScreenSize.height + 200) {
        enemyShots.splice(enemyShots.indexOf(this), 1);
        engine.removeActor(this);
      }
    }
  }

  class EnemyGrunt extends StaticBody {
    speed;
    target;
    shotDelay;
    hitpoints;
    constructor(x, y, width = 93, height = 84, hitpoints = 3) {
      super(x, y, width, height);
      this.sprite = enemyGruntSprite;
      this.speed = 300;
      this.target = { x: x, y: y };
      this.shotDelay = 1;
      this.hitpoints = hitpoints;
    }
    update(delta) {
      this.shotDelay = Math.max(0, this.shotDelay - delta);
      if (this.shotDelay <= 0) {
        const newShot = new EnemyShot(
          this.position.x + this.dimensions.width / 2,
          this.position.y + this.dimensions.height
        );
        this.shotDelay = 2;
        engine.audio.play("laser");
        enemyShots.push(newShot);
        engine.addActor(newShot);
      }
      if (
        !(
          this.position.x === this.target.x && this.position.y === this.target.y
        )
      ) {
        const directionVector = {
          x: this.target.x - this.position.x,
          y: this.target.y - this.position.y,
        };
        const directionVectorValue = Math.sqrt(
          directionVector.x ** 2 + directionVector.y ** 2
        );
        directionVector.x = directionVector.x / directionVectorValue;
        directionVector.y = directionVector.y / directionVectorValue;
        if (directionVectorValue >= this.speed * delta) {
          this.position.x =
            this.position.x + directionVector.x * this.speed * delta;
          this.position.y =
            this.position.y + directionVector.y * this.speed * delta;
        } else {
          this.position.x = this.target.x;
          this.position.y = this.target.y;
        }
      }
      playerShots.forEach((playerShot) => {
        if (engine.physics.collide(this, playerShot)) {
          this.hitpoints -= 1;
          engine.audio.play("hit");
          playerShots.splice(playerShots.indexOf(playerShot), 1);
          engine.removeActor(playerShot);
        }
      });
      if (this.hitpoints <= 0) {
        engine.audio.play("explosion");
        onScreenEnemies.splice(onScreenEnemies.indexOf(this), 1);
        engine.removeActor(this);
      }
    }
  }

  class SpaceGameScene extends Scene {
    playerShip;
    constructor() {
      super();
    }
    preUpdates() {
      canvasAutoAdjust();
    }

    postUpdates() {
      asteroids.forEach((asteroid) => {
        if (engine.physics.collide(asteroid, this.playerShip)) {
          engine.audio.play("explosion");
          asteroids.splice(asteroids.indexOf(asteroid), 1);
          engine.removeActor(asteroid);
          this.playerShip.damage();
        }
        playerShots.forEach((shot) => {
          if (engine.physics.collide(asteroid, shot)) {
            playerShots.splice(playerShots.indexOf(shot), 1);
            engine.audio.play("hit_asteroid");
            engine.removeActor(shot);
          }
        });
      });
      enemyShots.forEach((enemyShot) => {
        if (engine.physics.collide(enemyShot, this.playerShip)) {
          engine.audio.play("explosion");
          enemyShots.splice(enemyShots.indexOf(enemyShot), 1);
          engine.removeActor(enemyShot);
          this.playerShip.damage();
        }
      });

      if (this.playerShip.hitpoints <= 0) {
        engine.removeActor(this.playerShip);
        engine.loadScene(gameOverScene);
      }
    }

    onSceneEntry() {
      super.onSceneEntry();

      class WaitStep extends LevelStep {
        timePassed;

        constructor(time) {
          super((delta) => {
            this.timePassed += delta;
            if (this.timePassed >= time) {
              this.next = true;
              engine.removeActor(this);
            }
          });
          this.timePassed = 0;
        }
      }

      class AsteroidStep extends LevelStep {
        constructor() {
          super((delta) => {
            this.timePassed += delta;
            if (!this.init) {
              engine.addActor(this.asteroidGenerator);
              this.init = true;
              this.asteroidGeneratorRemoved = false;
            }
            if (this.timePassed >= 5 && !this.asteroidGeneratorRemoved) {
              engine.removeActor(this.asteroidGenerator);
              this.asteroidGeneratorRemoved = true;
            }
            if (this.timePassed >= 8) {
              this.next = true;
              engine.removeActor(this);
            }
          });
          this.init = false;
          this.timePassed = 0;
          this.asteroidGenerator = new AsteroidGenerator();
        }
      }

      const asteroidStep = new AsteroidStep();
      const asteroidStep2 = new AsteroidStep();

      const enemyStep = new LevelStep((delta) => {
        if (!enemyStep.init) {
          const enemyGrunt = new EnemyGrunt(0, 0);
          enemyGrunt.target = {
            x:
              GLOBALS.virtualScreenSize.width / 2 -
              enemyGrunt.dimensions.width / 2,
            y: 200,
          };
          onScreenEnemies.push(enemyGrunt);
          engine.addActor(enemyGrunt);
          enemyStep.init = true;
        }
        if (onScreenEnemies.length === 0) {
          enemyStep.next = true;
          engine.removeActor(enemyStep);
        }
      });
      enemyStep.init = false;

      const enemyStep2 = new LevelStep((delta) => {
        if (!enemyStep2.init) {
          const enemyGrunt = new EnemyGrunt(-100, 0);
          enemyGrunt.target = {
            x:
              GLOBALS.virtualScreenSize.width / 2 -
              enemyGrunt.dimensions.width / 2 -
              100,
            y: 200,
          };
          const enemyGrunt2 = new EnemyGrunt(
            GLOBALS.virtualScreenSize.width,
            0
          );
          enemyGrunt2.target = {
            x:
              GLOBALS.virtualScreenSize.width / 2 -
              enemyGrunt2.dimensions.width / 2 +
              100,
            y: 200,
          };
          onScreenEnemies.push(enemyGrunt);
          engine.addActor(enemyGrunt);
          onScreenEnemies.push(enemyGrunt2);
          engine.addActor(enemyGrunt2);
          enemyStep2.init = true;
        }
        if (onScreenEnemies.length === 0) {
          enemyStep2.next = true;
          engine.removeActor(enemyStep);
        }
      });
      enemyStep2.init = false;

      const enemyStep3 = new LevelStep((delta) => {
        if (!enemyStep3.init) {
          const enemyGrunt = new EnemyGrunt(-100, 150);
          enemyGrunt.target = {
            x:
              GLOBALS.virtualScreenSize.width / 2 -
              enemyGrunt.dimensions.width / 2 -
              100,
            y: 200,
          };
          const enemyGrunt2 = new EnemyGrunt(
            GLOBALS.virtualScreenSize.width,
            150
          );
          enemyGrunt2.target = {
            x:
              GLOBALS.virtualScreenSize.width / 2 -
              enemyGrunt2.dimensions.width / 2 +
              100,
            y: 200,
          };
          const enemyGrunt3 = new EnemyGrunt(-100, 0);
          enemyGrunt3.target = {
            x:
              GLOBALS.virtualScreenSize.width / 2 -
              enemyGrunt.dimensions.width / 2 -
              250,
            y: 100,
          };
          const enemyGrunt4 = new EnemyGrunt(
            GLOBALS.virtualScreenSize.width,
            0
          );
          enemyGrunt4.target = {
            x:
              GLOBALS.virtualScreenSize.width / 2 -
              enemyGrunt2.dimensions.width / 2 +
              250,
            y: 100,
          };
          onScreenEnemies.push(enemyGrunt);
          engine.addActor(enemyGrunt);
          onScreenEnemies.push(enemyGrunt2);
          engine.addActor(enemyGrunt2);
          onScreenEnemies.push(enemyGrunt3);
          engine.addActor(enemyGrunt3);
          onScreenEnemies.push(enemyGrunt4);
          engine.addActor(enemyGrunt4);
          enemyStep3.init = true;
        }
        if (onScreenEnemies.length === 0) {
          enemyStep3.next = true;
        }
      });
      enemyStep3.init = false;

      const movingEnemyStep = new LevelStep((delta) => {
        const goRight = () => {
          movingEnemyStep.enemyGrunt.target = {
            x:
              GLOBALS.virtualScreenSize.width -
              movingEnemyStep.enemyGrunt.dimensions.width -
              10,
            y: 200,
          };
          movingEnemyStep.enemyGrunt.side = "right";
        };

        if (!movingEnemyStep.init) {
          movingEnemyStep.enemyGrunt = new EnemyGrunt(-100, 200);
          goRight();
          onScreenEnemies.push(movingEnemyStep.enemyGrunt);
          engine.addActor(movingEnemyStep.enemyGrunt);
          movingEnemyStep.init = true;
        }

        if (
          movingEnemyStep.enemyGrunt.target.x ==
          movingEnemyStep.enemyGrunt.position.x
        ) {
          if (movingEnemyStep.enemyGrunt.side === "right") {
            movingEnemyStep.enemyGrunt.target = { x: 10, y: 200 };
            movingEnemyStep.enemyGrunt.side = "left";
          } else {
            goRight();
          }
        }

        if (onScreenEnemies.length === 0) {
          movingEnemyStep.next = true;
          engine.removeActor(enemyStep);
        }
      });
      movingEnemyStep.init = false;

      const winStep = new LevelStep((delta) => {
        engine.removeActor(winStep);
        engine.loadScene(winScene);
      });

      const spaceGameScript = new LevelScript([
        new WaitStep(0.5),
        asteroidStep,
        enemyStep,
        new WaitStep(0.25),
        enemyStep2,
        new WaitStep(0.25),
        enemyStep3,
        asteroidStep2,
        movingEnemyStep,
        new WaitStep(0.5),
        winStep,
      ]);
      this.actors = [];
      this.playerShip = new PlayerShip();
      this.actors.push(this.playerShip);
      this.actors.push(spaceGameScript);
      asteroids = [];
      playerShots = [];
      enemyShots = [];
    }

    postRenders() {
      super.postRenders();
    }
  }

  const spaceGameScene = new SpaceGameScene();

  class PlayerShot extends StaticBody {
    constructor(x, y, width = 9, height = 37) {
      super(x, y, width, height);
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
  startScene.onSceneEntry = () => {};

  startScene.preRenders = () => {};

  class EndState extends Scene {
    text;
    currentlyTouched;

    constructor(text) {
      super();
      this.text = text;
    }

    preUpdates() {
      canvasAutoAdjust();
    }

    postRenders() {
      GLOBALS.ctx.fillStyle = "#efefef";
      GLOBALS.ctx.font = `42px Arial`;
      GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
      GLOBALS.ctx.fillText(
        this.text,
        GLOBALS.virtualScreenSize.width / 2 -
          GLOBALS.ctx.measureText(this.text).width / 2,
        GLOBALS.virtualScreenSize.height / 2 - 24
      );
      const txt = "Touch/Click to start again";
      GLOBALS.ctx.fillText(
        txt,
        GLOBALS.virtualScreenSize.width / 2 -
          GLOBALS.ctx.measureText(txt).width / 2,
        GLOBALS.virtualScreenSize.height / 2 + 24
      );
      GLOBALS.ctx.resetTransform();
    }

    onSceneEntry() {
      this.currentlyTouched = GLOBALS.touch.active || GLOBALS.mouse.justClicked;
    }

    postUpdates() {
      if (this.currentlyTouched) {
        this.currentlyTouched =
          GLOBALS.touch.active || GLOBALS.mouse.justClicked;
      } else {
        if (GLOBALS.touch.active || GLOBALS.mouse.justClicked) {
          engine.loadScene(spaceGameScene);
        }
      }
    }
  }

  const gameOverScene = new EndState("GAME OVER!");
  const winScene = new EndState("CONGRATULATIONS YOU WON!");

  engine.loadScene(startScene);
};
