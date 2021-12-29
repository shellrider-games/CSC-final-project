import ShellriderEngine from "./shellriderEngine.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";
import { randomNumberBetween } from "./toolBox.js";
import StaticBody from "./staticBody.js";
import Actor from "./actor.js";
import Scene from "./scene.js";
import ShellriderButton from "./shellriderUIKit/button.js";
import Particle from "./particle.js";
import ParticleManager from "./particleManager.js";
import FireGenerator from "./fireGenerator.js";
import ScreenShaker from "./screenShaker.js";
import Vector2 from "./shellriderMath/vector2.js";

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
  await engine.audio.loadSound(
    "./assets/audio/effects/hit_asteroid.wav",
    "hit_asteroid"
  );
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

    getBoundingBox() {
      return {
        x: this.position.x + 8,
        y: this.position.y,
        width: this.dimensions.width - 16,
        height: this.dimensions.height - 16,
      };
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

  class PlayerShip extends StaticBody {
    speed;
    shotDelay;
    shield;
    nextShield;
    hitpoints;
    fireEngine1;
    fireEngine2;

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
      this.fireEngine1 = new FireGenerator(
        this.position.x + this.dimensions.width / 2 - 25,
        this.position.y + this.dimensions.height - 5,
        engine,
        { x: 0, y: 1 }
      );
      this.fireEngine2 = new FireGenerator(
        this.position.x + this.dimensions.width / 2 + 25,
        this.position.y + this.dimensions.height - 5,
        engine,
        { x: 0, y: 1 }
      );
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
      this.fireEngine1.position.x =
        this.position.x + this.dimensions.width / 2 - 25;
      this.fireEngine1.position.y =
        this.position.y + this.dimensions.height - 5;

      this.fireEngine2.position.x =
        this.position.x + this.dimensions.width / 2 + 25;
      this.fireEngine2.position.y =
        this.position.y + this.dimensions.height - 5;

      this.fireEngine1.update(delta);
      this.fireEngine2.update(delta);
    }
    render() {
      super.render();
      GLOBALS.ctx.save();
      if (this.shield) {
        GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
        GLOBALS.ctx.translate(
          this.position.x + this.dimensions.width / 2 - shieldSprite.width / 2,
          this.position.y - 20
        );
        GLOBALS.ctx.drawImage(shieldSprite.image, 0, 0);
        GLOBALS.ctx.restore();
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
    fireEngine;
    constructor(x, y, width = 93, height = 84, hitpoints = 3) {
      super(x, y, width, height);
      this.sprite = enemyGruntSprite;
      this.speed = 300;
      this.target = { x: x, y: y };
      this.shotDelay = 1;
      this.hitpoints = hitpoints;
      this.fireEngine = new FireGenerator(
        this.position.x + this.dimensions.width / 2,
        this.position.y + 5,
        engine
      );
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
      this.fireEngine.position.x = this.position.x + this.dimensions.width / 2;
      this.fireEngine.position.y = this.position.y + 5;

      this.fireEngine.update(delta);

      playerShots.forEach((playerShot) => {
        if (engine.physics.collide(this, playerShot)) {
          this.hitpoints -= 1;
          let shakeVector = new Vector2(1, 1);
          shakeVector = shakeVector.rotate(Math.random() * Math.PI * 2);
          engine.screenShaker.putAtPositon(shakeVector.x, shakeVector.y);
          engine.audio.play("hit");
          playerShots.splice(playerShots.indexOf(playerShot), 1);
          engine.removeActor(playerShot);
        }
      });
      if (this.hitpoints <= 0) {
        let shakeVector = new Vector2(10, 10);
        shakeVector = shakeVector.rotate(Math.random() * Math.PI * 2);
        engine.screenShaker.putAtPositon(shakeVector.x, shakeVector.y);
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

    postUpdates(delta) {
      asteroids.forEach((asteroid) => {
        if (engine.physics.collide(asteroid, this.playerShip)) {
          engine.audio.play("explosion");
          asteroids.splice(asteroids.indexOf(asteroid), 1);
          engine.removeActor(asteroid);
          this.playerShip.damage();
          let shakeVector = new Vector2(50, 50);
          shakeVector = shakeVector.rotate(Math.random() * Math.PI * 2);
          engine.screenShaker.putAtPositon(shakeVector.x, shakeVector.y);
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
          let shakeVector = new Vector2(50, 50);
          shakeVector = shakeVector.rotate(Math.random() * Math.PI * 2);
          engine.screenShaker.putAtPositon(shakeVector.x, shakeVector.y);
        }
      });

      if (this.playerShip.hitpoints <= 0) {
        engine.removeActor(this.playerShip);
        engine.loadScene(gameOverScene);
      }
    }

    onSceneEntry() {
      this.actors = [];
      onScreenEnemies = [];
      playerShots = [];
      asteroids = [];
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
      class EnemyStep extends LevelStep {
        init;
        constructor(init = () => {}, func = (delta) => {}) {
          super((delta) => {
            if (!this.init) {
              init();
              this.init = true;
            }
            func(delta);
            if (onScreenEnemies.length === 0) {
              this.next = true;
              engine.removeActor(this);
            }
          });
          this.init = false;
        }
      }
      const asteroidStep = new AsteroidStep();
      const asteroidStep2 = new AsteroidStep();
      const enemyStep = new EnemyStep(() => {
        const enemyGrunt = new EnemyGrunt(0, 0);
        enemyGrunt.target = {
          x:
            GLOBALS.virtualScreenSize.width / 2 -
            enemyGrunt.dimensions.width / 2,
          y: 200,
        };
        onScreenEnemies.push(enemyGrunt);
        engine.addActor(enemyGrunt);
      });
      const enemyStep2 = new EnemyStep(() => {
        const enemyGrunt = new EnemyGrunt(-100, 0);
        enemyGrunt.target = {
          x:
            GLOBALS.virtualScreenSize.width / 2 -
            enemyGrunt.dimensions.width / 2 -
            100,
          y: 200,
        };
        const enemyGrunt2 = new EnemyGrunt(GLOBALS.virtualScreenSize.width, 0);
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
      });
      const enemyStep3 = new EnemyStep(() => {
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
        const enemyGrunt4 = new EnemyGrunt(GLOBALS.virtualScreenSize.width, 0);
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
      });

      class PatrolingGrunt extends EnemyGrunt {
        wayPoints;
        currentTargetPoint;
        constructor(x, y, wayPoints = []) {
          super(x, y);
          if (wayPoints.length >= 1) {
            this.target = wayPoints[0];
            this.currentTargetPoint = 0;
          }
          this.wayPoints = wayPoints;
        }

        update(delta) {
          super.update(delta);
          if (
            this.position.x === this.target.x &&
            this.position.y === this.target.y
          ) {
            this.currentTargetPoint =
              (this.currentTargetPoint + 1) % this.wayPoints.length;
            this.target = this.wayPoints[this.currentTargetPoint];
          }
        }
      }

      const movingEnemyStep = new EnemyStep(() => {
        movingEnemyStep.enemyGrunt = new PatrolingGrunt(-100, 200, [
          { x: GLOBALS.virtualScreenSize.width - 110, y: 200 },
          { x: 10, y: 200 },
        ]);
        onScreenEnemies.push(movingEnemyStep.enemyGrunt);
        engine.addActor(movingEnemyStep.enemyGrunt);
      });

      const movingEnemyStep2 = new EnemyStep(() => {
        movingEnemyStep2.enemyGrunt1 = new PatrolingGrunt(-100, 350, [
          { x: GLOBALS.virtualScreenSize.width - 110, y: 300 },
          { x: 10, y: 300 },
        ]);
        movingEnemyStep2.enemyGrunt2 = new PatrolingGrunt(
          GLOBALS.virtualScreenSize.width + 100,
          200,
          [
            { x: 10, y: 200 },
            { x: GLOBALS.virtualScreenSize.width - 110, y: 200 },
          ]
        );
        movingEnemyStep2.enemyGrunt3 = new PatrolingGrunt(-100, 50, [
          { x: GLOBALS.virtualScreenSize.width - 110, y: 50 },
          { x: 10, y: 50 },
        ]);
        onScreenEnemies.push(movingEnemyStep2.enemyGrunt1);
        onScreenEnemies.push(movingEnemyStep2.enemyGrunt2);
        onScreenEnemies.push(movingEnemyStep2.enemyGrunt3);
        engine.addActor(movingEnemyStep2.enemyGrunt1);
        engine.addActor(movingEnemyStep2.enemyGrunt2);
        engine.addActor(movingEnemyStep2.enemyGrunt3);
      });

      const sineEnemyPattern = new EnemyStep(() => {
        const widthEighth = (GLOBALS.virtualScreenSize.width - 110) / 8;
        const ySway = (n, yEpsilon) => {
          return Math.sin((n * Math.PI) / 4) * yEpsilon;
        };

        sineEnemyPattern.enemyGrunt1 = new PatrolingGrunt(-100, 400, [
          { x: 10, y: 400 },
          { x: widthEighth, y: 400 + ySway(1, 100) },
          { x: 2 * widthEighth, y: 400 + ySway(2, 100) },
          { x: 3 * widthEighth, y: 400 + ySway(3, 100) },
          { x: 4 * widthEighth, y: 400 + ySway(4, 100) },
          { x: 5 * widthEighth, y: 400 + ySway(5, 100) },
          { x: 6 * widthEighth, y: 400 + ySway(6, 100) },
          { x: 7 * widthEighth, y: 400 + ySway(7, 100) },
          { x: 8 * widthEighth, y: 400 + ySway(8, 100) },
          { x: 7 * widthEighth, y: 400 + ySway(9, 100) },
          { x: 6 * widthEighth, y: 400 + ySway(10, 100) },
          { x: 5 * widthEighth, y: 400 + ySway(11, 100) },
          { x: 4 * widthEighth, y: 400 + ySway(12, 100) },
          { x: 3 * widthEighth, y: 400 + ySway(13, 100) },
          { x: 2 * widthEighth, y: 400 + ySway(14, 100) },
          { x: 1 * widthEighth, y: 400 + ySway(15, 100) },
        ]);

        sineEnemyPattern.enemyGrunt2 = new PatrolingGrunt(
          GLOBALS.virtualScreenSize + 100,
          150,
          [
            { x: 8 * widthEighth, y: 150 },
            { x: 7 * widthEighth, y: 150 - ySway(3, 100) },
            { x: 6 * widthEighth, y: 150 - ySway(4, 100) },
            { x: 5 * widthEighth, y: 150 - ySway(5, 100) },
            { x: 4 * widthEighth, y: 150 - ySway(6, 100) },
            { x: 3 * widthEighth, y: 150 - ySway(7, 100) },
            { x: 2 * widthEighth, y: 150 - ySway(8, 100) },
            { x: 1 * widthEighth, y: 150 - ySway(9, 100) },
            { x: 10, y: 150 + ySway(10, 100) },
            { x: 1 * widthEighth, y: 150 - ySway(11, 100) },
            { x: 2 * widthEighth, y: 150 - ySway(12, 100) },
            { x: 3 * widthEighth, y: 150 - ySway(13, 100) },
            { x: 4 * widthEighth, y: 150 - ySway(14, 100) },
            { x: 5 * widthEighth, y: 150 - ySway(15, 100) },
            { x: 6 * widthEighth, y: 150 - ySway(16, 100) },
            { x: 7 * widthEighth, y: 150 - ySway(17, 100) },
          ]
        );

        onScreenEnemies.push(sineEnemyPattern.enemyGrunt1);
        onScreenEnemies.push(sineEnemyPattern.enemyGrunt2);
        engine.addActor(sineEnemyPattern.enemyGrunt1);
        engine.addActor(sineEnemyPattern.enemyGrunt2);
      });

      const winStep = new LevelStep((delta) => {
        engine.removeActor(winStep);
        engine.loadScene(winScene);
      });

      const spaceGameScript = new LevelScript([
        new WaitStep(0.5),
        enemyStep,
        new WaitStep(0.25),
        enemyStep2,
        new WaitStep(0.25),
        enemyStep3,
        asteroidStep,
        movingEnemyStep,
        new WaitStep(0.25),
        movingEnemyStep2,
        new WaitStep(0.25),
        sineEnemyPattern,
        asteroidStep2,
        new WaitStep(0.5),
        winStep,
      ]);

      this.playerShip = new PlayerShip();
      this.actors.push(this.playerShip);
      this.actors.push(spaceGameScript);
      engine.actors = this.actors;
    }
    postRenders() {
      super.postRenders();
    }
  }
  const spaceGameScene = new SpaceGameScene();

  const startButton = new ShellriderButton(
    GLOBALS.virtualScreenSize.width / 2 - 180,
    GLOBALS.virtualScreenSize.height / 2 - 40,
    360,
    80,
    "START GAME"
  );
  startButton.onRelease = () => {
    engine.loadScene(spaceGameScene);
  };

  const startScene = new Scene([startButton]);
  startScene.preUpdates = () => {
    canvasAutoAdjust();
  };
  startScene.postRenders = () => {};
  startScene.postUpdates = (delta) => {};
  startScene.onSceneEntry = () => {};

  startScene.preRenders = () => {};

  class EndState extends Scene {
    text;
    currentlyTouched;

    constructor(text, actors = []) {
      super(actors);
      this.text = text;
    }

    preUpdates() {
      canvasAutoAdjust();
    }

    postRenders() {
      GLOBALS.ctx.save();
      GLOBALS.ctx.fillStyle = "#efefef";
      GLOBALS.ctx.font = `42px Arial`;
      GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
      GLOBALS.ctx.fillText(
        this.text,
        GLOBALS.virtualScreenSize.width / 2 -
          GLOBALS.ctx.measureText(this.text).width / 2,
        GLOBALS.virtualScreenSize.height / 2 - 100
      );
      GLOBALS.ctx.restore();
    }
    onSceneEntry() {}
    postUpdates() {}
  }

  const restartButton = new ShellriderButton(
    GLOBALS.virtualScreenSize.width / 2 - 180,
    GLOBALS.virtualScreenSize.height / 2 - 40,
    360,
    80,
    "RESTART"
  );
  restartButton.onRelease = () => {
    engine.loadScene(spaceGameScene);
  };

  const gameOverScene = new EndState("GAME OVER!", [restartButton]);
  const winScene = new EndState("CONGRATULATIONS YOU WON!", [restartButton]);

  engine.loadScene(startScene);
};
