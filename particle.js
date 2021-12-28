import Actor from "./actor.js";
import { GLOBALS } from "./shellriderEngineGlobals.js";

class Particle extends Actor {
  position;
  radius;
  rgbColour;
  timeToLive;
  ellapsedTime;
  direction;
  speed;

  constructor(x, y, radius = 10, rgbColour=[255,255,255],timeToLive = 1, direction = {x:0, y:0}, speed = 0) {
    super();
    this.position = {x: x, y: y };
    this.radius = radius;
    this.rgbColour = rgbColour;
    this.timeToLive = timeToLive;
    this.ellapsedTime = 0;
    this.direction = direction;
    this.speed = speed;
  }

  render(){
      GLOBALS.ctx.save();
      GLOBALS.ctx.translate(this.position.x, this.position.y);
      GLOBALS.ctx.fillStyle = `rgba(${this.rgbColour[0]},${this.rgbColour[1]},${this.rgbColour[2]},${(this.timeToLive-this.ellapsedTime)/this.timeToLive})`;
      GLOBALS.ctx.beginPath();
      GLOBALS.ctx.ellipse(0,0,this.radius,this.radius,0,0,Math.PI*2);
      GLOBALS.ctx.fill();
      GLOBALS.ctx.restore();
  }

  update(delta){
    this.ellapsedTime += delta;
    if(!(this.direction.x === 0 && this.direction.y === 0)){
        const directionValue = Math.sqrt((this.direction.x**2+this.direction.y**2));
        const normalizedDirection = {x: this.direction.x/directionValue, y: this.direction.y/directionValue};
        this.position.x += normalizedDirection.x * delta * this.speed;
        this.position.y += normalizedDirection.y * delta * this.speed;
    }
  }
}

export default Particle;