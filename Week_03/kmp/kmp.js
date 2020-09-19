function kmp(source, pattern) {
    if (!pattern) return 0;
    let table = findPatternTable(pattern);

    let i = 0;
    let j = 0;
    while (i < source.length) {
        if (pattern[j] === source[i]) {
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

function test(source, pattern) {
    console.group('test');
    // console.log(source, pattern, kmp(source, pattern));
    var p = kmp(source, pattern);
    if (p === -1) {
        console.log(source, pattern, `不存在匹配`);
        document.body.insertAdjacentHTML('beforeend', `<p>${source}, ${pattern} 不存在匹配</p><br/>`);
    } else {
        console.log(source, pattern, `存在匹配，开始位置为 ${p}`);
        var sourceHTML = source.substring(0, p) + `<span style="color:red">${source.substr(p, pattern.length)}</span>` + source.substr(p + pattern.length);
        document.body.insertAdjacentHTML('beforeend', `<p>${source}, ${pattern} 存在匹配，开始位置为 ${p}</p> <p>${sourceHTML}</p><br/>`);
    }
    console.groupEnd('test');
}
test('hello', 'll');
test('helxlo', 'll');
test('abcdabcdabcex', 'abcdabce');
test('aabaabaaac', 'aabaaac');

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
        if (pattern[i] === pattern[j]) {
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
