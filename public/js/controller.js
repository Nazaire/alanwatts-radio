import getUtils from './utils.js';
import ParticleGenerator from './classes/particlegenerator.js';

var context = {}; // Context to pass to objects
var ctx, utils;

export default {
  canvas: null,
  ctx: null,
  width: null,
  height: null,

  running: false,
  stop: false,
  ct: null, // current time (ms)

  objects: [],
  objectKeys: {},
  stage: [],
  globalState: {},

  init(canvas) {

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.objects = [];
    this.objectKeys = {};
    this.stage = [];
    this.globalState = {};

    ctx = this.ctx;
    utils = getUtils(this);
    context = {
      controller: this,
      utils,
      state: this.globalState
    };

    if (this.running) {
      this.stop = true;
      this.onStepEnd = () => {
        this.stop = false;
        this.startStep();
      };
    } else {
      this.startStep();
    }
  },

  addObject(object, stage = null) {
    if (object.id) {
      if (this.objectKeys[object.id]) {
        throw Error(`An object with id '${object.id}' is already defined`);
      }

      this.objectKeys[object.id] = object;
    }
    this.objects.push(object);

    if (stage) {
      this.stage.push(object);
    }
  },

  startStep() {
    this.running = true;

    this.addObject(new ParticleGenerator());

    window.requestAnimationFrame(this.step.bind(this));
  },

  step(newTime) {
    var dt = 0;
    if (this.ct) {
      dt = newTime - this.ct;
    }
    this.ct = newTime;

    if (this.stop) return this.afterStep();

    // Tick objects
    for (const object of this.objects) {
      object.tick(context, dt);
    }

    // Clear screen
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.width, this.height);

    for (const drawable of this.stage) {
      drawable.draw(ctx);
    }


    window.requestAnimationFrame(this.step.bind(this));
  },

  afterStep() {
    this.running = false;

    /* is anything waiting? */
    if (this.onStepEnd) {
      this.onStepEnd();
      this.onStepEnd = null;
    }
  }


};