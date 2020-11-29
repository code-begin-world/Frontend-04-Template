import { TimeLine, Animation } from './animation';
import { ease, easeOut, easeIn, easeInOut } from './ease';

window.tl = new TimeLine();

window.a1 = new Animation(
  document.querySelector('#el1').style,
  'transform',
  0,
  window.innerWidth - 100,
  2000,
  0,
  ease,
  (v) => `translateX(${v}px)`
);
window.a2 = new Animation(
  document.querySelector('#el2').style,
  'transform',
  0,
  window.innerWidth - 100,
  2000,
  0,
  easeIn,
  (v) => `translateX(${v}px)`
);
window.a3 = new Animation(
  document.querySelector('#el3').style,
  'transform',
  0,
  window.innerWidth - 100,
  2000,
  0,
  easeOut,
  (v) => `translateX(${v}px)`
);
window.a4 = new Animation(
  document.querySelector('#el4').style,
  'transform',
  0,
  window.innerWidth - 100,
  2000,
  0,
  easeInOut,
  (v) => `translateX(${v}px)`
);

document.getElementById('start').addEventListener('click', () => {
  window.tl.add(a1);
  window.tl.add(a2);
  window.tl.add(a3);
  window.tl.add(a4);

  tl.start();
  document.getElementById('start').remove();
  document.getElementById('restart').removeAttribute('hidden');
});
document.getElementById('restart').addEventListener('click', () => {
  tl.restart();
});

document.getElementById('pause').addEventListener('click', () => {
  tl.pause();
});
document.getElementById('resume').addEventListener('click', () => {
  tl.resume();
});
