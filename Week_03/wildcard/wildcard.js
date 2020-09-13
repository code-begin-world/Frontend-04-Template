function find(source, pattern) {
    // 统计 * 个数
    let startCount = 0;
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === '*') {
            startCount++;
        }
    }

    if (startCount === 0) {
        // 无 * 即严格匹配 要求一样的
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] !== source[i] && pattern[i] != '?') {
                return false;
            }
        }
        return;
    }

    let i = 0;
    // 处理掉第一个 * 前的内容
    let lastIndex = 0;
    for (i = 0; pattern[i] !== '*'; i++) {
        if (pattern[i] !== source[i] && pattern[i] != '?') {
            return false;
        }
    }
    lastIndex = i;

    // 处理中间的 *abc 的情况
    for (let p = 0; p < startCount - 1; p++) {
        i++;
        let subPattern = '';
        while (pattern[i] !== '*') {
            subPattern += pattern[i];
            i++;
        }

        // todo 可尝试用 kmp 替换掉正则
        // 尝试将 ? 转化为正则的任意字符 并进行正则匹配
        let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
        reg.lastIndex = lastIndex;
        let result = reg.exec(source);
        console.log(result);
        if (!result) {
            return false;
        }
        lastIndex = reg.lastIndex;
    }

    // 最后匹配尾部的 *
    // 若尾部最后为 * 前面已经匹配 * 为任意字符，则不变进行，包含匹配
    // 否则 从后往前检查每一位 直到遇到 * 或 前面匹配过的位置结束
    for (let j = 0; j <= source.length - lastIndex && pattern[pattern.length - j] !== '*'; j++) {
        if (pattern[pattern.length - j] !== source[source.length - j] && pattern[pattern.length - j] !== '?') {
            return false;
        }
    }
    return true;
}

function test(source, pattern) {
    console.group('test');
    var p = find(source, pattern);

    console.log(source, pattern, `${p ? '' : '不'}存在匹配`);
    document.body.insertAdjacentHTML('beforeend', `<p>${source}, ${pattern} ${p ? '' : '不'}存在匹配</p><br/>`);
    console.groupEnd('test');
}
test('hello', '*ll*');
test('abcdabcdabcex', '*abcdabce?');
test('aabaabaaac', 'aabaaac');
