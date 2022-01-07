import Scene from "../engineSrc/scene.js";
import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import LevelStep from "./levelStep.js";
import AsteroidStep from "./asteroidStep.js";
import EnemyGrunt from "./enemyGrunt.js";
import LevelScript from "./levelScript.js";
import PlayerShip from "./playerShip.js";
import { canvasAutoAdjust } from "../index.js";
import Vector2 from "../shellriderMath/vector2.js";
import WaitStep from "./waitStep.js";
import EnemyStep from "./enemyStep.js";
import PatrolingGrunt from "./patrolingGrunt.js";
import SpreadShotEnemy from "./spreadShotEnemy.js";

class SpaceGameScene extends Scene {
  playerShip;
  constructor() {
    super();
  }
  preUpdates() {
    canvasAutoAdjust();
  }

  postUpdates(delta) {
    GLOBALS.gamedata.asteroids.forEach((asteroid) => {
      if (GLOBALS.engine.physics.collide(asteroid, this.playerShip)) {
        GLOBALS.engine.audio.play("explosion");
        GLOBALS.gamedata.asteroids.splice(
          GLOBALS.gamedata.asteroids.indexOf(asteroid),
          1
        );
        GLOBALS.engine.removeActor(asteroid);
        this.playerShip.damage();
        let shakeVector = new Vector2(50, 50);
        shakeVector = shakeVector.rotate(Math.random() * Math.PI * 2);
        GLOBALS.engine.screenShaker.putAtPositon(shakeVector.x, shakeVector.y);
      }
      GLOBALS.gamedata.playerShots.forEach((shot) => {
        if (GLOBALS.engine.physics.collide(asteroid, shot)) {
          GLOBALS.gamedata.playerShots.splice(
            GLOBALS.gamedata.playerShots.indexOf(shot),
            1
          );
          GLOBALS.engine.audio.play("hit_asteroid");
          GLOBALS.engine.removeActor(shot);
        }
      });
    });
    GLOBALS.gamedata.enemyShots.forEach((enemyShot) => {
      if (GLOBALS.engine.physics.collide(enemyShot, this.playerShip)) {
        GLOBALS.engine.audio.play("explosion");
        GLOBALS.gamedata.enemyShots.splice(
          GLOBALS.gamedata.enemyShots.indexOf(enemyShot),
          1
        );
        GLOBALS.engine.removeActor(enemyShot);
        this.playerShip.damage();
        let shakeVector = new Vector2(50, 50);
        shakeVector = shakeVector.rotate(Math.random() * Math.PI * 2);
        GLOBALS.engine.screenShaker.putAtPositon(shakeVector.x, shakeVector.y);
      }
    });

    if (this.playerShip.hitpoints <= 0) {
      GLOBALS.engine.removeActor(this.playerShip);
      GLOBALS.engine.loadScene(GLOBALS.scenes.gameOverScene);
    }
  }

  onSceneEntry() {
    this.actors = [];
    GLOBALS.gamedata.onScreenEnemies = [];
    GLOBALS.gamedata.playerShots = [];
    GLOBALS.gamedata.asteroids = [];
    GLOBALS.gamedata.enemyShots = [];
    super.onSceneEntry();

    const asteroidStep = new AsteroidStep();
    const asteroidStep2 = new AsteroidStep();
    const enemyStep = new EnemyStep(() => {
      const enemyGrunt = new EnemyGrunt(0, 0);
      enemyGrunt.target = {
        x:
          GLOBALS.virtualScreenSize.width / 2 - enemyGrunt.dimensions.width / 2,
        y: 200,
      };
      GLOBALS.gamedata.onScreenEnemies.push(enemyGrunt);
      GLOBALS.engine.addActor(enemyGrunt);
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
      GLOBALS.gamedata.onScreenEnemies.push(enemyGrunt);
      GLOBALS.engine.addActor(enemyGrunt);
      GLOBALS.gamedata.onScreenEnemies.push(enemyGrunt2);
      GLOBALS.engine.addActor(enemyGrunt2);
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
      const enemyGrunt2 = new EnemyGrunt(GLOBALS.virtualScreenSize.width, 150);
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
      GLOBALS.gamedata.onScreenEnemies.push(enemyGrunt);
      GLOBALS.engine.addActor(enemyGrunt);
      GLOBALS.gamedata.onScreenEnemies.push(enemyGrunt2);
      GLOBALS.engine.addActor(enemyGrunt2);
      GLOBALS.gamedata.onScreenEnemies.push(enemyGrunt3);
      GLOBALS.engine.addActor(enemyGrunt3);
      GLOBALS.gamedata.onScreenEnemies.push(enemyGrunt4);
      GLOBALS.engine.addActor(enemyGrunt4);
    });

    const movingEnemyStep = new EnemyStep(() => {
      movingEnemyStep.enemyGrunt = new PatrolingGrunt(-100, 200, [
        { x: GLOBALS.virtualScreenSize.width - 110, y: 200 },
        { x: 10, y: 200 },
      ]);
      GLOBALS.gamedata.onScreenEnemies.push(movingEnemyStep.enemyGrunt);
      GLOBALS.engine.addActor(movingEnemyStep.enemyGrunt);
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
      GLOBALS.gamedata.onScreenEnemies.push(movingEnemyStep2.enemyGrunt1);
      GLOBALS.gamedata.onScreenEnemies.push(movingEnemyStep2.enemyGrunt2);
      GLOBALS.gamedata.onScreenEnemies.push(movingEnemyStep2.enemyGrunt3);
      GLOBALS.engine.addActor(movingEnemyStep2.enemyGrunt1);
      GLOBALS.engine.addActor(movingEnemyStep2.enemyGrunt2);
      GLOBALS.engine.addActor(movingEnemyStep2.enemyGrunt3);
    });

    const spreadEnemyStep1 = new EnemyStep(() => {
      const spreadEnemy = new SpreadShotEnemy(GLOBALS.virtualScreenSize.width/2 - 52, -200);
      spreadEnemy.target = {
        x:
          GLOBALS.virtualScreenSize.width / 2 - spreadEnemy.dimensions.width / 2,
        y: 360,
      };
      GLOBALS.gamedata.onScreenEnemies.push(spreadEnemy);
      GLOBALS.engine.addActor(spreadEnemy);
    });

    const spreadEnemyStep2 = new EnemyStep(() => {
      const spreadEnemy1 = new SpreadShotEnemy(GLOBALS.virtualScreenSize.width/2 - 52 - 160, -200);
      spreadEnemy1.target = {
        x:
          GLOBALS.virtualScreenSize.width / 2 - spreadEnemy1.dimensions.width / 2 - 160,
        y: 250,
      };

      const spreadEnemy2 = new SpreadShotEnemy(GLOBALS.virtualScreenSize.width/2 - 52 + 160, -200);
      spreadEnemy2.target = {
        x:
          GLOBALS.virtualScreenSize.width / 2 - spreadEnemy2.dimensions.width / 2 + 160,
        y: 250,
      };

      GLOBALS.gamedata.onScreenEnemies.push(spreadEnemy1);
      GLOBALS.gamedata.onScreenEnemies.push(spreadEnemy2);
      GLOBALS.engine.addActor(spreadEnemy1);
      GLOBALS.engine.addActor(spreadEnemy2);
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

      GLOBALS.gamedata.onScreenEnemies.push(sineEnemyPattern.enemyGrunt1);
      GLOBALS.gamedata.onScreenEnemies.push(sineEnemyPattern.enemyGrunt2);
      GLOBALS.engine.addActor(sineEnemyPattern.enemyGrunt1);
      GLOBALS.engine.addActor(sineEnemyPattern.enemyGrunt2);
    });

    const winStep = new LevelStep((delta) => {
      GLOBALS.engine.removeActor(winStep);
      GLOBALS.engine.loadScene(GLOBALS.scenes.winScene);
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
      new WaitStep(0.25),
      spreadEnemyStep1,
      spreadEnemyStep2,
      new WaitStep(0.5),
      winStep,
    ]);

    this.playerShip = new PlayerShip();
    this.actors.push(this.playerShip);
    this.actors.push(spaceGameScript);
    GLOBALS.engine.actors = this.actors;
  }
  postRenders() {
    super.postRenders();
  }
}

export default SpaceGameScene;
