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
        return true;
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

        // #region 带 ? 的 kmp 方案
        let kmpResult = kmp(source.substr(lastIndex), subPattern);
        if (!~kmpResult) {
            // kmp 匹配失败则结束
            return false;
        }
        // 否则下次开始位置 向后移动
        lastIndex += kmpResult + subPattern.length;
        // #endregion

        // #region 正则方案
        // 尝试将 ? 转化为正则的任意字符 并进行正则匹配
        // let reg = new RegExp(subPattern.replace(/\?/g, '[\\s\\S]'), 'g');
        // reg.lastIndex = lastIndex;
        // let result = reg.exec(source);
        // console.log(result);
        // if (!result) {
        //     return false;
        // }
        // lastIndex = reg.lastIndex;
        // #endregion
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
test('abxxxamcxxdd', 'ab*a?c*dd');
test('hello', '*ll*');
test('abcdabcdabcex', '*abcdabce?');
test('aabaabaaac', 'aabaaac');

function kmp(source, pattern) {
    let table = findPatternTable(pattern);

    let i = 0;
    let j = 0;
    while (i < source.length) {
        if (pattern[j] === source[i] || pattern[j] === '?') {
            // 如果匹配 双指针移动
            i++;
            j++;
        } else {
            // 根据 pattern 表格回退
            if (j > 0) {
                j = table[j];
            } else {
                i++;
            }
        }
        if (j === pattern.length) {
            // debugger;
            // console.log(source, pattern, `存在匹配，开始位置为 ${i - j}`);
            return i - j;
        }
    }
    return -1;
}

function findPatternTable(pattern) {
    // 记录匹配到当前位置时 前面已经有多少内容是匹配的
    // 这样回退的时候可以直接回退到此位置再比较而不必存在不匹配就直接回退到0重新开始
    let table = new Array(pattern.length).fill(0);

    // abcdabce => [0, 0, 0, 0, 0, 1, 2, 3]
    // aabaaac => [0, 0, 1, 0, 1, 2, 2]
    // abababc => [0, 0, 0, 1, 2, 3, 4]
    let i = 1;
    let j = 0;
    while (i < pattern.length) {
        if (pattern[i] === pattern[j] || pattern[j] === '?') {
            // 相同的情况 前进 并标记
            i++;
            j++;
            if (i < pattern.length) {
                table[i] = j;
            }
        } else {
            // j = 0
            if (j > 0) {
                j = table[j];
            } else {
                i++;
            }
        }
        // debugger;
        // console.log(i, j, JSON.stringify(table));
    }
    console.log('PatternTable', table);
    return table;
}
