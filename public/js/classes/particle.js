import {
  TickableDrawable
} from './base.js';

export default class Particle extends TickableDrawable {
  constructor({
    pos,
    width,
    height,
    opacity = 1,
    fillStyle = '#FFFFFF'
  }) {
    super();
    Object.assign(this, {
      pos,
      width,
      height,
      opacity,
      fillStyle
    });

    this.phaseOffset = opacity * 2 * Math.PI;
    this.vel = new Vec2(0, 0); // v2 per second 
    this.acc = null; // v2 per second ^ 2

    this.lineWidth = 2 * Math.random() + 1;
    this.radius = 2 * Math.random() + 2;
  }
}
Particle.prototype.tick = function ({
  controller,
  utils
}, dt) {
  this.opacity = (Math.sin((controller.ct / 500) + this.phaseOffset) + (Math.PI / 2)) / Math.PI;

  // apply acceleration
  if (this.acc) {
    this.vel.add(this.acc.multiply(dt / 1000));
    this.acc = null;
  }
  this.vel = this.vel.lerp(new Vec2(0, 0), 0.1);
  this.pos.add(this.vel);
};
Particle.prototype.draw = function (ctx) {
  ctx.fillStyle = this.fillStyle;
  ctx.globalAlpha = this.opacity;

  // ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);

  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
  ctx.lineWidth = this.lineWidth;
  ctx.strokeStyle = this.fillStyle;
  ctx.fill();
};