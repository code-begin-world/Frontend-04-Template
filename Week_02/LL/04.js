const dictionary = ['Number', 'Whitespace', 'LineTerminator', '*', '/', '+', '-'];
function* tokenize(source) {
    const regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;

    let result = null;
    let lastIndex = 0; // 记录上一次匹配完成的结束索引
    console.log('input', source);
    while (true) {
        lastIndex = regexp.lastIndex;
        result = regexp.exec(source);
        if (!result) break;
        // 新的匹配的 结束位置 - 上一次的结束位置 > 当前匹配 则标识当前匹配和上一次匹配之间存在不认识的字符
        if (regexp.lastIndex - lastIndex > result[0].length) {
            throw new Error(`unknown token at ${lastIndex} , 【${source[lastIndex]}】 is unknown.`);
            break;
        }

        const token = { type: '', value: '' };

        for (let i = 1; i <= dictionary.length; i++) {
            if (result[i]) {
                token.type = dictionary[i - 1];
            }
        }
        token.value = result[0];
        yield token;
    }
}

function* tokenize2(source) {
    const regexp = /([0-9\.]+)|([ \t]+)|([\r\n]+)|(\*)|(\/)|(\+)|(\-)/g;
    let result = null;
    let index = 0; // 记录匹配开始索引
    console.log('input', source);
    while (true) {
        result = regexp.exec(source);
        if (!result) break;

        // 若匹配到的位置和预期开始位置不一致 则存在不认识的字符
        if (index != result.index) {
            throw new Error(`unknown token at ${index} , 【${source[index]}】 is unknown`);
            break;
        }
        // 更新下次匹配应该的开始位置
        index += result[0].length;

        const token = { type: '', value: '' };

        for (let i = 1; i <= dictionary.length; i++) {
            if (result[i]) {
                token.type = dictionary[i - 1];
            }
        }
        token.value = result[0];
        yield token;
    }
    yield { type: 'EOF' };
}

function getTokens(input) {
    const tokens = [];
    for (let t of tokenize2(input)) {
        if (!~['Whitespace', 'LineTerminator'].indexOf(t.type)) {
            tokens.push(t);
        }
    }
    return tokens;
}

function Expression(source) {
    if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === 'EOF') {
        const node = {
            type: 'Expression',
            children: [source.shift(), source.shift()]
        };
        source.unshift(node);
        return node;
    }

    AdditiveExpression(source);
    return Expression(source);
}

function AdditiveExpression(source) {
    if (source[0].type == 'MultiplicativeExpression') {
        const node = {
            type: 'AdditiveExpression',
            children: [source[0]]
        };
        source[0] = node;
        return AdditiveExpression(source);
    }

    if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '+') {
        const node = {
            type: 'AdditiveExpression',
            operator: '+',
            children: [source.shift(), source.shift()]
        };
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }
    if (source[0].type === 'AdditiveExpression' && source[1] && source[1].type === '-') {
        const node = {
            type: 'AdditiveExpression',
            operator: '-',
            children: [source.shift(), source.shift()]
        };
        MultiplicativeExpression(source);
        node.children.push(source.shift());
        source.unshift(node);
        return AdditiveExpression(source);
    }

    if (source[0].type === 'AdditiveExpression') {
        // console.log(source);
        return source[0];
    }

    MultiplicativeExpression(source);
    return AdditiveExpression(source);
}
// 乘法表达
function MultiplicativeExpression(source) {
    // 如果开头是数字 直接构造乘法 开始递归
    if (source[0].type === 'Number') {
        const node = {
            type: 'MultiplicativeExpression',
            children: [source[0]]
        };
        source[0] = node;
        return MultiplicativeExpression(source);
    }

    // 已经是乘法了 且下一个是 * 号
    if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '*') {
        const node = {
            type: 'MultiplicativeExpression',
            operator: '*',
            children: [source.shift(), source.shift(), source.shift()]
        };
        source.unshift(node);
        return MultiplicativeExpression(source);
    }
    if (source[0].type === 'MultiplicativeExpression' && source[1] && source[1].type === '/') {
        const node = {
            type: 'MultiplicativeExpression',
            operator: '/',
            children: [source.shift(), source.shift(), source.shift()]
        };
        source.unshift(node);
        return MultiplicativeExpression(source);
    }

    if (source[0].type === 'MultiplicativeExpression') {
        // console.log(source);
        return source[0];
    }

    console.error('maybe something wrong');
    return MultiplicativeExpression(source);
}

// MultiplicativeExpression(getTokens('10 * 25 / 2'));
