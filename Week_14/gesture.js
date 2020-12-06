export class Dispatcher {
  constructor(element) {
    this.element = element;
  }
  dispatch(type, properties) {
    let e = new Event(type);
    if (properties) {
      for (let k in properties) {
        e[k] = properties[k];
      }
    }
    this.element.dispatchEvent(e);
  }
}
export class Listener {
  constructor(element, recognizer) {
    let isListeningMouse = false;

    const contexts = new Map();

    element.addEventListener('mousedown', function (event) {
      const button = event.button;
      // if (button !== 0 ) return;

      const context = Object.create(null);
      contexts.set('mouse-' + (1 << button), context);

      recognizer.start(event, context);

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
            recognizer.move(event, context);
          }
          button = button << 1;
        }
      };

      let mouseup = (event) => {
        let k = 'mouse-' + (1 << event.button);
        let context = contexts.get(k);
        recognizer.end(event, context);
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

    element.addEventListener('touchstart', function (event) {
      for (let touch of event.changedTouches) {
        const context = Object.create(null);
        contexts.set(touch.identifier, context);
        recognizer.start(touch, context);
      }
    });

    element.addEventListener('touchmove', function (event) {
      for (let touch of event.changedTouches) {
        recognizer.move(touch, contexts.get(touch.identifier));
      }
    });

    element.addEventListener('touchend', function (event) {
      for (let touch of event.changedTouches) {
        recognizer.end(touch, contexts.get(touch.identifier));
        contexts.delete(touch.identifier);
      }
    });
    // 如 alert 等会导致 touch 流程打断 会进入 cancel
    element.addEventListener('touchcancel', function (event) {
      for (let touch of event.changedTouches) {
        recognizer.cancel(touch, contexts.get(touch.identifier));
        contexts.delete(touch.identifier);
      }
    });
  }
}

export class Recognizer {
  constructor(dispatcher) {
    this.dispatcher = dispatcher;
  }
  start(point, context) {
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
      this.dispatcher.dispatch('press', {});
      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      context.handler = null;
    }, 500);
  }
  move(point, context) {
    let dx = point.clientX - context.startX;
    let dy = point.clientY - context.startY;
    // 是否移动 10px
    if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;
      context.isVertical = Math.abs(dx) < Math.abs(dy);
      this.dispatcher.dispatch('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
      clearTimeout(context.handler);
    }
    if (context.isPan) {
      this.dispatcher.dispatch('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical
      });
    }
    context.points = context.points.filter((point) => Date.now() - point.t < 500);
    context.points.push({
      t: Date.now(),
      x: point.clientX,
      y: point.clientY
    });
  }
  end(point, context) {
    if (context.isTap) {
      this.dispatcher.dispatch('tap', {});
      clearTimeout(context.handler);
    }

    if (context.isPress) {
      this.dispatcher.dispatch('pressend', {});
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

      this.dispatcher.dispatch('flick', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick,
        velocity: v
      });
    } else {
      context.isFlick = false;
    }
    if (context.isPan) {
      this.dispatcher.dispatch('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        isVertical: context.isVertical,
        isFlick: context.isFlick
      });
    }
  }
  cancel(point, context) {
    clearTimeout(context.handler);
    this.dispatcher.dispatch('cancel', {});
  }
}

export function enableGesture(element) {
  new Listener(element, new Recognizer(new Dispatcher(element)));
}
