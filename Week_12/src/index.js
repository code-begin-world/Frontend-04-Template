import { createElement, Component } from './frame.js';

class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');
    if (this.attributes && Array.isArray(this.attributes.src)) {
      for (let item of this.attributes.src) {
        let child = document.createElement('div');
        child.style.backgroundImage = `url(${item})`;
        this.root.appendChild(child);
      }
    } else {
      return;
    }
    let position = 0;
    this.root.addEventListener('mousedown', (ev) => {
      console.log('mousedown');

      const children = this.root.children;
      const x0 = ev.clientX;
      // const y0 = ev.clientY;

      const move = (ev) => {
        console.log('mousemove');
        const x = ev.clientX - x0;

        let current = position - (x - (x % 500)) / 500;

        for (let offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
        }
      };

      const up = (ev) => {
        console.log('mouseup');
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);

        const x = ev.clientX - x0;
        position = position - Math.round(x / 500);
        for (let offset of [0, -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
          let pos = position + offset;
          pos = (pos + children.length) % children.length;

          children[pos].style.transition = 'none';
          children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + (x % 500)}px)`;
        }
      };
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });
    /*
    let currentIndex = 0;
    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (currentIndex + 1) % children.length;

      const next = children[nextIndex];

      next.style.transform = 'none';
      next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

      setTimeout(() => {
        next.style.transform = '';
        children[currentIndex].style.transform = `translateX(${-100 - currentIndex * 100}%)`;
        next.style.transform = `translateX(${-nextIndex * 100}%)`;

        currentIndex = nextIndex;
      }, 17);
    }, 3000);
    */
    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
let arr = [
  'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
  'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
  'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
  'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
];
let div = <Carousel id="div" src={arr}></Carousel>;

// document.body.appendChild(div);

div.mountTo(document.body);
