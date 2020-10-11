// https://zh.wikipedia.org/wiki/KMP%E7%AE%97%E6%B3%95

// 主入口函数
function find(str) {
  
}

// 定义一个函数 根据输入获取状态切换函数
function getState(c,) {}

// 查找跳转表 用于 状态机匹配时切换状态
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
