import ShellriderEngine from "./engineSrc/shellriderEngine.js";
import { GLOBALS } from "./engineSrc/shellriderEngineGlobals.js";
import Scene from "./engineSrc/scene.js";
import ShellriderButton from "./shellriderUIKit/button.js";
import SpaceGameScene from "./gameSrc/spaceGameScene.js";
import EndState from "./gameSrc/endState.js";

window.toggleDebug = function () {
  GLOBALS.debug = !GLOBALS.debug;
  return GLOBALS.debug;
};

export function canvasAutoAdjust() {
  GLOBALS.canvasSize.height =
    Math.min((window.innerWidth / 9) * 16, window.innerHeight) - 1;
  GLOBALS.canvasSize.width =
    Math.min((window.innerHeight / 16) * 9, window.innerWidth) - 1;
}

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
  const kenneyFuture = new FontFace(
    "KenneyFuture",
    "url(./assets/fonts/KenneyFuture.ttf)"
  );
  await kenneyFuture.load();
  document.fonts.add(kenneyFuture);

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
  GLOBALS.sprites.asteroidSprite = await engine.requestSprite(
    "./assets/img/meteorGrey_big1.png"
  );
  GLOBALS.sprites.laserShotSprite = await engine.requestSprite(
    "./assets/img/laserGreen13.png"
  );
  GLOBALS.sprites.enemyGruntSprite = await engine.requestSprite(
    "./assets/img/enemyBlue1.png"
  );
  GLOBALS.sprites.spreadShotEnemySprite = await engine.requestSprite(
    "./assets/img/enemyBlue2.png"
  );
  GLOBALS.sprites.enemyLaserSprite = await engine.requestSprite(
    "./assets/img/laserRed15.png"
  );
  GLOBALS.sprites.playerShipSprite = await engine.requestSprite(
    "./assets/img/playerShip1_red.png"
  );
  GLOBALS.sprites.shieldSprite = await engine.requestSprite(
    "./assets/img/shield1.png"
  );
  GLOBALS.sprites.enemySpreadLaserSprite = await engine.requestSprite(
    "./assets/img/laserRed10.png"
  );

  GLOBALS.scenes.spaceGameScene = new SpaceGameScene();

  const startButton = new ShellriderButton(
    GLOBALS.virtualScreenSize.width / 2 - 180,
    GLOBALS.virtualScreenSize.height / 2 - 40,
    360,
    80,
    "START GAME"
  );
  startButton.onRelease = () => {
    engine.loadScene(GLOBALS.scenes.spaceGameScene);
  };

  const startScene = new Scene([startButton]);
  startScene.preUpdates = () => {
    canvasAutoAdjust();
  };
  startScene.postRenders = () => {
    GLOBALS.ctx.save();
    GLOBALS.ctx.fillStyle = "#efefef";
    GLOBALS.ctx.font = `24px KenneyFuture`;
    const txt = "a game by Georg Becker";
    const txt2 = "images and font from Kenney";
    GLOBALS.ctx.scale(GLOBALS.scaleFactor.x, GLOBALS.scaleFactor.y);
    GLOBALS.ctx.fillText(
      txt,
      440 - GLOBALS.ctx.measureText(txt2).width / 2,
      1200
    );
    GLOBALS.ctx.fillText(
      txt2,
      440 - GLOBALS.ctx.measureText(txt2).width / 2,
      1240
    );
    GLOBALS.ctx.restore();
  };
  startScene.postUpdates = (delta) => {};
  startScene.onSceneEntry = () => {};

  startScene.preRenders = () => {};

  const restartButton = new ShellriderButton(
    GLOBALS.virtualScreenSize.width / 2 - 180,
    GLOBALS.virtualScreenSize.height / 2 - 40,
    360,
    80,
    "RESTART"
  );
  restartButton.onRelease = () => {
    engine.loadScene(GLOBALS.scenes.spaceGameScene);
  };

  GLOBALS.scenes.gameOverScene = new EndState("GAME OVER!", [restartButton]);
  GLOBALS.scenes.winScene = new EndState("YOU WON!", [restartButton]);

  engine.loadScene(startScene);
};
