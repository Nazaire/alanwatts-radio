import {
  SingletonTickable
} from "./base.js";
import Particle from "./particle.js";

const A_RANDOM_COLOR = []

export default class ParticleGenerator extends SingletonTickable {
  constructor() {
    super();
    this.id = 'pg';
    this.particles = [];
    this.particlesMax = 500;

    this.state = 'SETUP';
  }

  tick({
    controller,
    utils
  }, dt) {

    switch (this.state) {
      case 'SETUP':
        this.tick_setup({
          controller,
          utils
        });
        break;
      case 'NORMAL':
        this.tick_normal({
          controller,
          utils
        });
        break;
    }
  }

  tick_setup({
    controller,
    utils
  }) {
    for (const particle of this.particles) {
      var movement = particle.pos.clone().subtract(utils.centerPos()).normalize().multiply((Math.cos((controller.ct + particle.phaseOffset) / 3000) / Math.PI));
      particle.pos.add(movement);

      if (particle.pos.distance(utils.centerPos()) > 100) {
        var toVector = particle.pos.clone().normalize().multiply(0.25 * utils.sqBound);
        particle.pos = particle.pos.lerp(utils.centerPos(), 0.1);
      }
    }

    var songIsReady = window.SoundFile ? window.SoundFile.isLoaded() : false;

    // Add new particles
    if (this.particles.length < this.particlesMax) {
      var randomOffset = utils.randomRadius(utils.sqBound * (1 - (this.particles.length / this.particlesMax)));
      var newParticle = new Particle({
        pos: utils.centerPos().add(randomOffset),
        width: 10,
        height: 10,
        opacity: Math.random(),
        fillStyle: '#FFFFFF'
      });
      this.particles.push(newParticle);
      controller.addObject(newParticle, controller.stage);
    } else if (songIsReady) {
      // Play the audio
      if (!window.SoundFile.isPlaying()) window.SoundFile.play();
      // Go to next state
      this.state = 'NORMAL';
    }
  }

  tick_normal({
    controller,
    utils
  }) {
    let rms = window.AudioAnalyzer ? window.AudioAnalyzer.getLevel() : 0;
    if (rms === undefined) rms = 0;

    for (var i = 0; i < this.particles.length; i++) {
      var particle = this.particles[i];

      // Movement due to rms (amplitude)
      var ampMove = particle.pos.clone().subtract(utils.centerPos()).normalize().multiply((rms * particle.phaseOffset));
      particle.pos.add(ampMove);

      // Movement due "breathing"
      var movement = particle.pos.clone().subtract(utils.centerPos()).normalize().multiply((Math.cos((controller.ct + particle.phaseOffset) / 3000) / Math.PI));
      particle.pos.add(movement);

      // Gravity pulls towards the center
      if (particle.pos.distance(utils.centerPos()) > 100 + (10 * particle.phaseOffset)) {
        var gravity = -3;
        if (particle.pos.distance(utils.centerPos()) > 200) {
          gravity -= particle.pos.distance(utils.centerPos()) - 200;
        }

        particle.acc = particle.pos.clone().subtract(utils.centerPos()).normalize().multiply(gravity);
      }


      // Particle "flicks" dependant on current rms
      if (Math.random() < Math.max(rms / 1000, 0.00001)) {
        particle.acc = particle.pos.clone().subtract(utils.centerPos()).normalize().multiply(1000);
      }

    }
  }
};