let element = document.documentElement;
let isListeningMouse = false;
element.addEventListener('mousedown', function (event) {
  const button = event.button;
  // if (button !== 0 ) return;

  const context = Object.create(null);
  contexts.set('mouse-' + (1 << button), context);

  start(event, context);

  let mousemove = (event) => {
    // 移动事件不包含具体按键 仅以掩码形式包含哪些键按下
    // move事件中 鼠标按下的键的值 中键和右键是相反的。。
    let button = 1;
    while (button <= event.buttons) {
      if (button & event.buttons) {
        let key = button;
        if (button === 2) {
          key = 4;
        } else if (button === 4) {
          key = 2;
        }
        let context = contexts.get('mouse-' + key);
        move(event, context);
      }
      button = button << 1;
    }
  };

  let mouseup = (event) => {
    let k = 'mouse-' + (1 << event.button);
    let context = contexts.get(k);
    end(event, context);
    contexts.delete(k);
    if (event.buttons === 0) {
      document.removeEventListener('mousemove', mousemove);
      document.removeEventListener('mouseup', mouseup);
      isListeningMouse = false;
    }
  };
  if (!isListeningMouse) {
    document.addEventListener('mousemove', mousemove);
    document.addEventListener('mouseup', mouseup);
    isListeningMouse = true;
  }
});

const contexts = new Map();
element.addEventListener('touchstart', function (event) {
  for (let touch of event.changedTouches) {
    console.log(touch.clientX, touch.clientY);
    const context = Object.create(null);
    contexts.set(touch.identifier, context);
    start(touch, context);
  }
});

element.addEventListener('touchmove', function (event) {
  for (let touch of event.changedTouches) {
    move(touch, contexts.get(touch.identifier));
  }
});

element.addEventListener('touchend', function (event) {
  for (let touch of event.changedTouches) {
    end(touch, contexts.get(touch.identifier));
    contexts.delete(touch.identifier);
  }
});
// 如 alert 等会导致 touch 流程打断 会进入 cancel
element.addEventListener('touchcancel', function (event) {
  for (let touch of event.changedTouches) {
    cancel(touch, contexts.get(touch.identifier));
    contexts.delete(touch.identifier);
  }
});

let start = (point, context) => {
  // console.log('start', point.clientX, point.clientX);
  context.startX = point.clientX;
  context.startY = point.clientY;
  context.points = [
    {
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    }
  ];
  context.isPan = false;
  context.isTap = true;
  context.isPress = false;
  context.isFlick = false;
  context.handler = setTimeout(() => {
    console.log('press start');
    context.isTap = false;
    context.isPan = false;
    context.isPress = true;
    context.handler = null;
  }, 500);
};

let move = (point, context) => {
  // console.log('move', point.clientX, point.clientX);
  let dx = point.clientX - context.startX;
  let dy = point.clientY - context.startY;
  // 是否移动 10px
  if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
    context.isTap = false;
    context.isPan = true;
    context.isPress = false;
    console.log('pan start');
    clearTimeout(context.handler);
  }
  if (context.isPan) {
    console.log('pan');
  }
  context.points = context.points.filter((point) => Date.now() - point.t < 500);
  context.points.push({
    t: Date.now(),
    x: point.clientX,
    y: point.clientY
  });
};
let end = (point, context) => {
  if (context.isTap) {
    // console.log('tap');
    dispatch('tap', {});
    clearTimeout(context.handler);
  }
  if (context.isPan) {
    console.log('panend');
  }

  if (context.isPress) {
    console.log('press end');
  }
  context.points = context.points.filter((point) => Date.now() - point.t < 500);
  let d, v;
  if (!context.points.length) {
    v = 0;
  } else {
    d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
    v = d / (Date.now() - context.points[0].t);
  }
  console.log('move speed (px/ms):', v);
  if (v > 1.5) {
    context.isFlick = true;
    console.log('flick');
  }
  console.log('end', point.clientX, point.clientX);
};
let cancel = (point, context) => {
  clearTimeout(context.handler);
  console.log('cancel', point.clientX, point.clientX);
};

function dispatch(type, properties) {
  let e = new Event(type);
  if (properties) {
    for (let k in properties) {
      e[k] = properties[k];
    }
  }
  element.dispatchEvent(e);
}
