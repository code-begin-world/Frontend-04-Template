// const po = new Proxy(obj, {
//     set(target, prop, value) {
//         console.log(...arguments);
//         target[prop] = value;
//     }
// });

let reactives = new Map();
let usedReactives = [];
const callbacks = new Map();
function effect(callback) {
    // callbacks.push(callback);
    usedReactives = [];
    callback();

    for (let reactivity of usedReactives) {
        if (!callbacks.has(reactivity[0])) {
            callbacks.set(reactivity[0], new Map());
        }
        const objMap = callbacks.get(reactivity[0]);
        if (!objMap.has(reactivity[1])) {
            objMap.set(reactivity[1], []);
        }

        objMap.get(reactivity[1]).push(callback);
    }
}

function reactive(source) {
    if (reactives.has(source)) {
        return reactives.get(source);
    }
    let proxy = new Proxy(source, {
        set(target, prop, value) {
            // console.log(...arguments);
            // console.log('set');
            target[prop] = value;

            const objMap = callbacks.get(target);
            if (objMap && objMap.has(prop)) {
                for (let cb of objMap.get(prop)) {
                    cb();
                }
            }

            return target[prop];
        },
        get(target, prop) {
            usedReactives.push([target, prop]);
            if (typeof target[prop] === 'object') {
                return reactive(target[prop]);
            }
            return target[prop];
        }
    });

    reactives.set(source, proxy);
    return proxy;
}

const obj = {
    a: 1,
    b: 2,
    pos: { x: 0, y: 0 }
};
const po = reactive(obj);

effect(() => {
    console.log(po.pos.x);
});
