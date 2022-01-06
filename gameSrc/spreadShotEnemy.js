import { GLOBALS } from "../engineSrc/shellriderEngineGlobals.js";
import Enemy from "./enemy.js";

class SpreadShotEnemy extends Enemy{
    constructor(x, y, width = 104, height = 84){
        super(x,y, width, height);
        this.sprite = GLOBALS.sprites.spreadShotEnemySprite;
    }
}

export default SpreadShotEnemy;