export class Tickable {

}
Tickable.prototype.tick = function (controller) {};

export class Drawable {

}
Drawable.prototype.draw = function () {};

export class TickableDrawable {

}
TickableDrawable.prototype.tick = Tickable.prototype.tick;
TickableDrawable.prototype.draw = Drawable.prototype.draw;

export class Singleton {
  constructor() {
    this.id = -1;
  }
}

export class SingletonTickable extends Singleton {
  constructor() {
    super();
  }
}
SingletonTickable.prototype.tick = Tickable.prototype.tick;