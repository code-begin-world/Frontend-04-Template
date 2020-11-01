/**
 * 编写一个 match 函数。它接收两个参数，第一个参数是一个选择器字符串性质，第二个是一个 HTML 元素。这个元素你可以认为它一定会在一棵 DOM 树里面。通过选择器和 DOM 元素来判断，当前的元素是否能够匹配到我们的选择器。（不能使用任何内置的浏览器的函数，仅通过 DOM 的 parent 和 children 这些 API，来判断一个元素是否能够跟一个选择器相匹配。）
 * @param {string} selector
 * @param {HTMLElement} element
 */
function match(selector, element) {
  const arr = selector.split(' ').reverse();

  let selectors = splitSelector(selector).reverse();
  let currentSelector = selectors[0];
  let prevSelector;
  let currentEl = element;

  // 检查元素自身是否匹配
  let selfMatch = getAllSingleSelector(currentSelector.value, element).every((s) => matchOne(s, currentEl));
  if (!selfMatch) {
    console.log(currentSelector.value, currentEl, '匹配失败');
    return false;
  }

  let allMatched = true;

  for (let i = 1; i < selectors.length; i++) {
    currentSelector = selectors[i];
    prevSelector = selectors[i - 1];

    // > 仅检查向上检查一层
    if (prevSelector.prev == '>') {
      currentEl = currentEl.parentElement;
      let matched = getAllSingleSelector(currentSelector.value).every((s) => matchOne(s, currentEl));
      if (!matched) {
        console.log(currentSelector.value, currentEl, '匹配失败');
        return false;
      }
    }
    // ' ' 需向上检查 n 层
    // TODO : 还需考虑 div>div div 倒数第二个div取哪个div 是否回溯等问题
    // 这里暂时只考向上找 找到就停止
    if (prevSelector.prev == ' ') {
      let sels = getAllSingleSelector(currentSelector.value);
      let matched = false;
      currentEl = currentEl.parentElement;
      while (currentEl) {
        matched = sels.every((s) => matchOne(s, currentEl));
        if (matched) {
          break;
        }
        currentEl = currentEl.parentElement;
      }
      if (!currentEl && !matched) {
        return false;
      }
    }

    // .a + .b
    // prevSelector {.b , +}  currentSelector: {.a, null} currentEl : .b
    // 到父元素的 children 中检查 当前元素的前一个元素是不是匹配选择器
    if (prevSelector.prev == '+') {
      const pChildren = currentEl.parentElement.children;
      const currentElIndex = [].slice.call(pChildren).indexOf(currentEl);
      let prevEl = pChildren[currentElIndex - 1];
      let matched = getAllSingleSelector(currentSelector.value).every((s) => matchOne(s, prevEl));
      if (!matched) {
        console.log(currentSelector.value, currentEl, '匹配失败');
        return false;
      } else {
        // 匹配成功则前移动
        currentEl = prevEl;
      }
    }

    // ~ 类似 + 但不止检查前一个 而是前面的所有
    if (prevSelector.prev == '~') {
      const pChildren = currentEl.parentElement.children;
      const currentElIndex = [].slice.call(pChildren).indexOf(currentEl);
      let prevElArr = [].slice.call(pChildren, 0, currentElIndex);

      let sels = getAllSingleSelector(currentSelector.value);
      let matched = false;
      let matchedEl = null;

      for (let j = 0; j < prevElArr.length; j++) {
        if (sels.every((s) => matchOne(s, prevElArr[j]))) {
          matched = true;
          matchedEl = prevElArr[j];
          break;
        }
      }
      // 成功则前移动元素
      if (matched) {
        currentEl = matchedEl;
      } else {
        return false;
      }
    }
  }

  return allMatched;
  // return true;
}

/**
 * 检查指定元素是否满足给定的选择器
 * @param {string} selector 单个的简单选择器
 * @param {HTMLElement} element 检查的元素
 */
function matchOne(selector, element) {
  if (!selector || !element) return false;
  if (selector === '*') return true;

  // ID
  if (selector[0] === '#') {
    return element.getAttribute('id') === selector.substr(1);
  }
  // class
  if (selector[0] === '.') {
    // return element.classList.contains(selector.substr(1));
    // 如果 classList.contains 也不能用的话
    return element.getAttribute('class').split(' ').includes(selector.substr(1));
  }
  // 属性
  if (selector[0] === '[' && selector[selector.length - 1] === ']') {
    let [prop, value] = selector.substr(1, selector.length - 2).split('=');

    // 仅属性
    if (!value) return element.hasAttribute(prop);
    // 属性  + 值
    // 去掉value的引号
    if (
      (value[0] === '"' || value[0] === "'") &&
      (value[value.length - 1] === '"' || value[value.length - 1] === "'")
    ) {
      value = value.substr(1, value.length - 2);
    }
    return value === element.getAttribute(prop);
  }
  // tag
  return selector.toUpperCase() === element.tagName;
}

/**
 * 将选择器 按照 [’ ‘,'>','+','~'] 进行拆分
 * @param {string} selector
 * @returns {selector []}
 * @example
 * 输入：'html > body div#div.div ~ a'
 * 输出：
 * [
 *    {"value":"html","prev":null},
 *    {"value":"body","prev":">"},
 *    {"value":"div#div.div","prev":" "},
 *    {"value":"a","prev":"~"}
 * ]
 *
 */
function splitSelector(selector) {
  const EOF = Symbol('EOF');
  let currentSelector = {
    value: '',
    prev: ' '
  };
  let arr = [];
  function stateFn(c) {
    if (c == '>') {
      currentSelector.value = '';
      currentSelector.prev = '>';
      return childSelectorStart;
    }
    if (c == '+') {
      currentSelector.value = '';
      currentSelector.prev = '+';
      return nearSiblingSelectorStart;
    }
    if (c == '~') {
      currentSelector.value = '';
      currentSelector.prev = '~';
      return siblingSelectorStart;
    }

    if (c == ' ') {
      currentSelector.value = '';
      currentSelector.prev = ' ';
      return posteritySelectorStart;
    }
    if (c == EOF) return;

    currentSelector.value = '';
    currentSelector.prev = null;
    return subSelector(c);
  }

  // ' ' 后代
  function posteritySelectorStart(c) {
    if (c == EOF) {
      throw new Error('选择器非法');
    } else if (c == '>' || c == '~' || c == '+') {
      return stateFn(c);
    } else if (c == ' ') {
      return posteritySelectorStart;
    } else {
      return subSelector(c);
    }
  }

  function subSelector(c) {
    if ([' ', '>', '+', '~', EOF].includes(c)) {
      arr.push(JSON.parse(JSON.stringify(currentSelector)));
      return stateFn(c);
    } else {
      currentSelector.value += c;
      return subSelector;
    }
  }

  // `>` 子代
  function childSelectorStart(c) {
    if (c == EOF || c == '>' || c == '~' || c == '+') {
      throw new Error('选择器非法');
    } else if (c == ' ') {
      return childSelectorStart;
    } else {
      return subSelector(c);
    }
  }

  // '+' 相邻兄弟
  function nearSiblingSelectorStart(c) {
    if (c == EOF || c == '>' || c == '~' || c == '+') {
      throw new Error('选择器非法');
    } else if (c == ' ') {
      return nearSiblingSelectorStart;
    } else {
      return subSelector(c);
    }
  }

  // ’~‘ 后续兄弟
  function siblingSelectorStart(c) {
    if (c == EOF || c == '>' || c == '~' || c == '+') {
      throw new Error('选择器非法');
    } else if (c == ' ') {
      return siblingSelectorStart;
    } else {
      return subSelector(c);
    }
  }

  let state = stateFn;
  for (let c of selector) {
    state = state(c);
  }

  state = state(EOF);
  console.log(`${selector} 拆分结果为：\n ${JSON.stringify(arr)}`);
  return arr;
}

// console.log(JSON.stringify(splitSelector('html > body div#div.div ~ a')));

/**
 * 将一个选择器拆分成简单的单个并列选择器
 * @param {string} selector
 * @returns {string []}
 * @example 'div#div.div[hidden]' => ['div' ,'#div', '.div', '[hidden]']
 */
function getAllSingleSelector(selector) {
  const EOF = Symbol('EOF');
  let currentSelector = '';
  let arr = [];
  function stateFN(c) {
    if (c == '#') {
      return idSelectorStart(c);
    }
    if (c == '.') {
      return classSelectorStart(c);
    }
    if (c == '[') {
      return propSelectorStart(c);
    }
    return tagSelectorStart(c);
    // return stateFN;
  }

  function idSelectorStart(c) {
    if (c == '.' || c == '[') {
      // return stateFN(c);
    } else if (c == '#') {
      currentSelector = c;
      return idSelector;
    }
  }
  function idSelector(c) {
    if (c == '#' || c == '.' || c == '[') {
      arr.push(currentSelector);
      return stateFN(c);
    } else {
      currentSelector += c;
      return idSelector;
    }
  }

  function classSelectorStart(c) {
    if (c == '#' || c == '[') {
      // return stateFN(c);
    } else if (c == '.') {
      currentSelector = c;
      return classSelector;
    }
  }
  function classSelector(c) {
    if (c == '#' || c == '.' || c == '[' || c == EOF) {
      arr.push(currentSelector);
      return stateFN(c);
    } else {
      currentSelector += c;
      return classSelector;
    }
  }

  function propSelectorStart(c) {
    if (c == '#' || c == '.') {
      // return stateFN(c);
    } else if (c == '[') {
      currentSelector = c;
      return propSelector;
    }
  }
  function propSelector(c) {
    if (c == ']') {
      currentSelector += c;
      arr.push(currentSelector);
      return stateFN;
    } else if (c == '#' || c == '.' || c == '[' || c == EOF) {
      throw new Error(`选择器不合法，预期] 但得到${c}`);
    } else {
      currentSelector += c;
      return propSelector;
    }
  }

  function tagSelectorStart(c) {
    if (c == '#' || c == '.' || c == '[') {
      // return stateFN(c);
    } else {
      currentSelector = c;
      return tagSelector;
    }
  }
  function tagSelector(c) {
    if (c == '#' || c == '.' || c == '[' || c == EOF) {
      arr.push(currentSelector);
      return stateFN(c);
    } else {
      currentSelector += c;
      return tagSelector;
    }
  }

  let state = stateFN;
  for (let c of selector) {
    state = state(c);
  }

  state = state(EOF);
  console.log(`${selector} 拆分结果为：\n ${JSON.stringify(arr)}`);
  return arr;
}

// console.log(getAllSingleSelector('[class="div"]div#div.div.abc.active[hidden]'));

console.log(match('html[lang=en] body #header.header > .h1 #test[abc]', document.getElementById('test')));

console.log(match('html[lang="en"]  body #header.header > .h1 + h2', document.getElementById('h2')));

console.log(match("html[lang='en'] body #header.header > h1.h1 ~ h2", document.getElementById('h3')));

console.log(match("html[lang='zh-CN'] body #header.header > h1.h1 ~ h2", document.getElementById('h3')));
