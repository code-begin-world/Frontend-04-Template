// https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects

const realms = {
    name: 'realms',
    children: [
        {
            name: '值属性',
            children: ['Infinity', 'NaN', 'undefined', 'globalThis']
        },
        {
            name: '函数属性',
            children: [
                'eval()',
                'uneval()',
                'isFinite()',
                'isNaN()',
                'parseFloat()',
                'parseInt()',
                'decodeURI()',
                'decodeURIComponent()',
                'encodeURI()',
                'encodeURIComponent()',
                '已废弃 escape()',
                '已废弃 unescape()'
            ]
        },
        {
            name: '基本对象',
            children: [
                {
                    name: 'Object',
                    children: [
                        {
                            name: 'Array',
                            children: [
                                'Int8Array',
                                'Uint8Array',
                                'Uint8ClampedArray',
                                'Int16Array',
                                'Uint16Array',
                                'Int32Array',
                                'Uint32Array',
                                'Float32Array',
                                'Float64Array',
                                'BigInt64Array',
                                'BigUint64Array'
                            ]
                        },
                        'Function',
                        'Boolean',
                        'RegExp',
                        'Date',
                        'Math',
                        'Symbol',
                        'String',
                        'Map',
                        'Set',
                        'WeakMap',
                        'WeakSet',
                        'ArrayBuffer',
                        'SharedArrayBuffer',
                        'Atomics',
                        'DataView',
                        'JSON',
                        'Promise',
                        'Generator',
                        'GeneratorFunction',
                        'AsyncFunction',
                        'Reflect',
                        'Proxy',
                        'Intl',
                        'WebAssembly',
                        'arguments'
                    ]
                }
            ]
        }
    ]
};

function dealChildren(obj) {
    obj.children = obj.children.map(item => {
        if (typeof item === 'string') {
            return { name: item };
        }
        if (item.children) {
            dealChildren(item);
        }
        return item;
    });
}

dealChildren(realms);


