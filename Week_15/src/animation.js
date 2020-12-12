import { easeOut } from './ease';

export class TimeLine {
  constructor() {
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestID = null;
    this.state = 'inited';

    this.tick = () => {
      let t = +new Date() - this.startTime;
      console.log('tick');
      for (let animation of this.animations) {
        let { object, property, template, start, end, duration, timeFunction, delay } = animation;

        let addTime = this.addTimes.get(animation);

        if (t < delay + addTime) continue;

        let progression = timeFunction((t - delay - addTime) / duration);
        if (t > duration + delay + addTime) {
          progression = 1;
          this.animations.delete(animation);
          this.finishedAnimations.add(animation);
        }

        let value = animation.valueFromProgression(progression);
        object[property] = value;
      }
      if (this.animations.size) {
        this.requestID = requestAnimationFrame(this.tick);
      } else {
        this.requestID = null;
      }
    };
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.pauseTime = +new Date();
    if (this.requestID !== null) {
      cancelAnimationFrame(this.requestID);
      this.requestID = null;
    }
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.startTime += +new Date() - this.pauseTime;
    this.tick();
  }

  start() {
    if (this.state !== 'inited') return;
    this.state = 'playing';
    this.startTime = +new Date();
    this.tick();
  }

  reset() {
    if (this.state === 'playing') this.pause();
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestID = null;
    this.startTime = +new Date();
    this.pauseTime = null;
    this.state = 'inited';
  }

  restart() {
    if (this.state === 'playing') this.pause();

    for (let animation of this.finishedAnimations) this.animations.add(animation);
    this.finishedAnimations = new Set();
    this.requestID = null;
    this.state = 'playing';
    this.startTime = +new Date();
    this.pauseTime = null;
    this.tick();
  }

  add(animation, addTime) {
    this.animations.add(animation);

    if (this.state === 'playing' && this.requestID !== null) this.tick();
    if (this.state === 'playing') {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : +new Date() - this.startTime);
    } else {
      this.addTimes.set(animation, addTime !== void 0 ? addTime : 0);
    }
    if (this.requestID=== null) {
      this.tick();
    }
  }
}

export class Animation {
  constructor(object, property, start, end, duration, delay, timeFunction = easeOut, template = (v) => v) {
    this.object = object;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timeFunction = timeFunction;
    this.template = template;
  }
  valueFromProgression(progression) {
    return this.template(this.start + progression * (this.end - this.start));
  }
}
