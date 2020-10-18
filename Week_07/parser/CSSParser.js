const css = require('css');
const rules = [];
// 收集 css 规则
exports.addCSSRules = function addCSSRules(text) {
  const ast = css.parse(text);
  console.log(ast);
  rules.push(...ast.stylesheet.rules);
};

/**
 *
 * @param {object} element 待检测元素
 * @param {string} selector 选择器
 */
function match(element, selector) {
  if (!selector || !element.attributes) return false;

  // id 选择器 #abc 以及 div#abc 两种情况
  const isIdSelector = /#/.test(selector);
  // class 选择器 .abc 以及 div.abc 两种情况
  const isClassSelector = /\./.test(selector);
  if (isIdSelector) {
    let temp = selector.split('#');
    // 是否有标签
    let tag = temp[0];
    let realId = temp[1];

    // 有标签但不能匹配
    if (tag && tag !== element.tagName) {
      return false;
    }

    let attr = element.attributes.filter((attr) => attr.name === 'id')[0];

    // if (attr && attr.value === selector.substr(1)) return true;
    return attr && attr.value === realId ? true : false;
  } else if (isClassSelector) {
    let temp = selector.split('.');
    // 是否有标签
    let tag = temp[0];
    let realCls = temp[1];

    // 有标签但不能匹配
    if (tag && tag !== element.tagName) {
      return false;
    }
    let attr = element.attributes.filter((attr) => attr.name === 'class')[0];

    // class 支持多个
    if (attr && attr.value.split(' ').some((cls) => cls === realCls)) {
      return true;
    } else {
      return false;
    }
  } else {
    return element.tagName === selector;
  }
}

// 计算css样式
exports.computedCSSStyle = function computedCSSStyle(element, stack) {
  // 此处是在 匹配一个标签 token 完成后 创建元素时调用
  // 已经假设此时css 已经完全收集完毕
  // 实际可能需要：
  // 1. 收集到新css规则时重新计算（对应在body中继续写style的情况）
  // 2. link 加载 css 完成后再次计算

  // 无需深拷贝
  const elements = stack.slice().reverse();

  if (!element.computedStyle) {
    element.computedStyle = {};
  }

  for (let rule of rules) {
    for (let selector of rule.selectors) {
      const selectorParts = selector.split(' ').reverse();

      if (!match(element, selectorParts[0])) {
        continue;
      }
      let matched = false;

      let j = 1;
      for (let i = 0; i < elements.length; i++) {
        if (match(elements[i], selectorParts[j])) {
          j++;
        }
        if (j >= selectorParts.length) {
          matched = true;
        }
        if (matched) {
          console.log('matched');
          const style = element.computedStyle;
          const sp = specificity(selector);
          for (let declaration of rule.declarations) {
            if (!style[declaration.property]) {
              style[declaration.property] = {};
            }
            // 覆盖前需要 计算优先级
            // style[declaration.property].value = declaration.value;

            if (!style[declaration.property].specificity) {
              style[declaration.property].specificity = sp;
              style[declaration.property].value = declaration.value;
            } else if (compareSpecificity(style[declaration.property].specificity, sp) < 0) {
              style[declaration.property].specificity = sp;
              style[declaration.property].value = declaration.value;
            }
          }
          console.log(element, style);
          break;
        }
      }
    }
  }
};

// #region specificity

// specificity 为一个四元组 [0, 0, 0, 0];
// 分别代表如下四种位置 inline id class tag 标签的style， id 选择器， class选择器， 标签选择器
// 比较权重时从左往右比较即可

// // example:
// div #id
// [0,1,0,1]

// div div #id
// [0,1,0, 2]

// div .div #id
// [0,1,1,1]

/**
 * 计算选择器的 specificity
 * @param {string} selector 选择器
 */
function specificity(selector) {
  const p = [0, 0, 0, 0];
  let selectorParts = selector.split(' ');

  for (let part of selectorParts) {
    let result;
    // #id div#id
    if ((result = part.split('#')).length > 1) {
      p[1]++;
      if (result[0]) {
        p[3]++;
      }
    } else if ((result = part.split('.')).length > 1) {
      // div.div
      p[2]++;
      if (result[0]) {
        p[3]++;
      }
    } else {
      p[3]++;
    }
  }

  return p;
}

function compareSpecificity(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0];
  } else if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1];
  } else if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2];
  }
  return sp1[3] - sp2[3];
}
// #endregion
