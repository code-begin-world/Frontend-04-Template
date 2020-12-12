import { createElement, Component, ATTRIBUTE, STATE } from './frame.js';

import { enableGesture } from './gesture';
import { TimeLine, Animation } from './animation';
import { ease } from './ease';

export { ATTRIBUTE, STATE } from './frame';

export class Carousel extends Component {
  constructor() {
    super();
    this[STATE].position = 0;
    this.carouselItems = [];
    this.handler = null;
    this.timeline = new TimeLine();
    this.template = (v) => `translateX(${v}px)`;
    this.t = 0;
  }
  // setAttribute(name, value) {
  //   this.attributes[name] = value;
  // }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    if (Array.isArray(this[ATTRIBUTE].src)) {
      for (let item of this[ATTRIBUTE].src) {
        let child = document.createElement('div');
        child.style.backgroundImage = `url(${item.img})`;
        child.textContent = item.text;
        this.root.appendChild(child);
      }
    }
    enableGesture(this.root);

    this.timeline.start();

    let children = this.root.children;
    let ax = 0;

    this.root.addEventListener('start', (event) => {
      clearInterval(this.handle);
      this.timeline.pause();
      let t = Date.now() - this.t;
      let progress = t > 500 || this.t === 0 ? 0 : t / 500;
      progress = progress - Math.floor(progress);
      ax = -ease(progress) * 500;
    });
    this.root.addEventListener('tap', (event) => {
      this.triggerEvent('click', {
        data: this[ATTRIBUTE].src[this[STATE].position],
        position: this[STATE].position
      });
    });

    this.root.addEventListener('pan', (event) => {
      let position = this[STATE].position;
      let x = event.clientX - event.startX - ax;
      let current = position - (x - (x % 500)) / 500;

      for (let offset of [-1, 0, 1]) {
        let pos = (current + offset) % children.length;
        pos = ((pos % children.length) + children.length) % children.length;
        // children[pos].style.transition = 'none';
        children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
      }
    });

    this.root.addEventListener('end', (event) => {
      this.timeline.reset();
      this.timeline.start();
      this.handle = setInterval(nextPicture, 3000);

      let x = event.clientX - event.startX - ax;

      let direction = Math.sign((x % 500) / 500);
      console.log(direction);

      let progress = Math.abs((x % 500) / 500);
      const min = Math.min(progress, 1 - progress) * 500;
      let position = this[STATE].position;
      position = position - Math.round(x / 500);
      let next = Math.sign(progress - 0.5) * direction;

      for (let offset of [0, next]) {
        let pos = (position + offset) % children.length;
        pos = ((pos % children.length) + children.length) % children.length;
        const end = (offset - pos) * 500;
        const start = end + min * -next;
        // children[pos].style.transition = 'none';
        // children[pos].style.transform = `translateX(${end}px)`;
        this.timeline.add(
          new Animation(
            children[pos].style,
            'transform',
            end + min * -next,
            end,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      this[STATE].position = position - (x - (x % 500)) / 500 - direction;
    });

    let nextPicture = () => {
      let position = this[STATE].position;
      let children = this.root.children;
      let nextIndex = (position + 1) % children.length;

      let current = children[position];
      let next = children[nextIndex];

      this.t = Date.now();

      console.log(position, nextIndex);
      console.log(current, next);

      this.timeline.add(
        new Animation(
          current.style,
          'transform',
          -position * 500,
          -500 - position * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );
      this.timeline.add(
        new Animation(
          next.style,
          'transform',
          500 - nextIndex * 500,
          -nextIndex * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      this[STATE].position = nextIndex;
    };

    this.handle = setInterval(nextPicture, 3000);

    return this.root;
  }
  // mountTo(parent) {
  //   parent.appendChild(this.render());
  // }
}
